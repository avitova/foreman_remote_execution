module Actions
  module RemoteExecution
    class ProxyAction < ::Actions::ProxyAction
      include Actions::RemoteExecution::TemplateInvocationProgressLogging

      def on_data(data, meta = {})
        super
        process_proxy_data(output[:proxy_output])
      end

      def run(event = nil)
        with_template_invocation_error_logging { super }
      end

      private

      def get_proxy_data(response)
        data = super
        process_proxy_data(data)
        data
      end

      def process_proxy_template(output, template)
        b = binding
        b.local_variable_set(:output, output)
        result = ERB.new(template, nil, '-').result(b)
        return result
      end

      def process_proxy_data(data)
        events = data['result'].each_with_index.map do |update, seq_id|
          {
            # For N-1 compatibility, we assume that the output provided here is
            # complete
            sequence_id: update['sequence_id'] || seq_id,
            template_invocation_id: template_invocation.id,
            event: update['output'],
            timestamp: Time.at(update['timestamp']).getlocal,
            event_type: update['output_type'],
          }
        end
        if data['exit_status']
          last = events.last || {:sequence_id => -1, :timestamp => Time.zone.now}
          events << {
            sequence_id: last[:sequence_id] + 1,
            template_invocation_id: template_invocation.id,
            event: data['exit_status'],
            timestamp: last[:timestamp],
            event_type: 'exit',
          }
        end
        outputs = events.length
        output_templates = template_invocation.job_invocation.output_templates
        last = events.last || {:sequence_id => -1, :timestamp => Time.zone.now}
        sequence_id = last[:sequence_id] + 1
        output_templates.each_with_index.map do |output_templ, templ_id|
          for i in 0..outputs-1 do
            if events[i][:event].instance_of?(String) && events[i][:event_type] == 'stdout'
              events << {
                sequence_id: sequence_id + templ_id,
                template_invocation_id: template_invocation.id,
                event: process_proxy_template(events[i][:event], output_templ.template),
                timestamp: events[i][:timestamp] || Time.zone.now,
                event_type: 'template_output',
              }
            end
          end
        end
        events.each_slice(1000) do |batch|
          TemplateInvocationEvent.upsert_all(batch, unique_by: [:template_invocation_id, :sequence_id]) # rubocop:disable Rails/SkipsModelValidations
        end
      end
    end
  end
end
