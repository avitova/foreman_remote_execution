module Actions
  module RemoteExecution
    class OutputProcessing < Dynflow::Action
      def process_proxy_template(output, template)
        b = binding
        b.local_variable_set(:output, output)
        ERB.new(template, nil, '-').result(b)
      end

      def run
          events = TemplateInvocationEvent.find_by(template_invocation_id: input[:template_invocation_id])
          sequence_id = events[-1].sequence_id
          output_templates = template_invocation.job_invocation.output_templates
          output_templates.each_with_index.map do |output_templ, templ_id|
            sequence_id += 1
            for i in 0..outputs-1 do
              if events[i][:event].instance_of?(String) && events[i][:event_type] == 'stdout'
                events << {
                  sequence_id: sequence_id,
                  template_invocation_id: templatef_invocation.id,
                  event: process_proxy_template(events[i][:event], output_templ.template),
                  timestamp: events[i][:timestamp] || Time.zone.now,
                  event_type: 'template_output',
                }
              end
              sequence_id += 1
            end
          end
        end    
    end
  end
end
  