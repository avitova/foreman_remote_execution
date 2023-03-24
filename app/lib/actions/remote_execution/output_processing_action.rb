module Actions
  module RemoteExecution
    class OutputProcessing < Dynflow::Action
      def process_proxy_template(output, template)
        box = Safemode::Box.new
        erb = ERB.new(template, trim_mode: '-')
        box.eval(erb.src, locals={output: output})
      end

      def run
        processed_outputs = []
        template_invocation = TemplateInvocation.find(input[:template_invocation_id])
        events = template_invocation.template_invocation_events
        sq_id = events.max_by { |e| e.sequence_id }.sequence_id + 1
        output_templates = template_invocation.job_invocation.output_templates
        output_templates.each_with_index.map do |output_templ, templ_id|
          for i in 0..events.length-1 do
            if events[i][:event].instance_of?(String) && events[i][:event_type] == 'stdout'
              processed_outputs << {
                sequence_id: sq_id,
                template_invocation_id: template_invocation.id,
                event: process_proxy_template(events[i][:event], output_templ.template),
                timestamp: events[i][:timestamp] || Time.zone.now,
                event_type: 'template_output',
              }
              sq_id += 1
            end
          end
        end
        processed_outputs.each_slice(1000) do |batch|
          TemplateInvocationEvent.upsert_all(batch, unique_by: [:template_invocation_id, :sequence_id]) # rubocop:disable Rails/SkipsModelValidations
        end
      end
    end
  end
end
