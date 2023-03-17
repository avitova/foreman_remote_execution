class OutputTemplatesController < ::TemplatesController
    include ::Foreman::Controller::Parameters::OutputTemplate

    def load_vars_from_template
      return unless @output_template
    end

    # private

    def find_resource
      if params[:id]
        super
      else
        @output_template = resource_class.new(params[type_name_plural])
      end
    end

    def action_permission
        super
    end
  end
