module Api
  module V2
    class OutputTemplatesController < ::Api::V2::BaseController
      include ::Api::Version2
      include ::Foreman::Renderer
      include ::Foreman::Controller::ProvisioningTemplates
      include ::Foreman::Controller::Parameters::OutputTemplate


      api :GET, '/output_templates/', N_('List output templates')
      param_group :taxonomy_scope, ::Api::V2::BaseController
      param_group :search_and_pagination, ::Api::V2::BaseController
      def index
        @output_templates = resource_scope_for_index
      end

      def_param_group :output_template do
        param :output_template, Hash, :required => true, :action_aware => true do
          param :name, String, :required => true, :desc => N_('Template name')
          param :description, String
          param :template, String, :required => true
          param :output, String
          param :snippet, :bool, :allow_nil => true
          param :locked, :bool, :desc => N_('Whether or not the template is locked for editing')
          param :effective_user_attributes, Hash, :desc => N_('Effective user options') do
            param :value, String, :desc => N_('What user should be used to run the script (using sudo-like mechanisms)'), :allowed_nil => true
            param :overridable, :bool, :desc => N_('Whether it should be allowed to override the effective user from the invocation form.')
            param :current_user, :bool, :desc => N_('Whether the current user login should be used as the effective user')
          end
          param_group :taxonomies, ::Api::V2::BaseController
        end
      end

      api :POST, '/output_templates/', N_('Create an output template')
      param_group :output_template, :as => :create
      def create
        @output_template = OutputTemplate.new(output_template_params)
        process_response @output_template.save
      end

      api :DELETE, '/output_templates/:id', N_('Delete an output template')
      param :id, :identifier, :required => true
      def destroy
        process_response @output_template.destroy
      end
    end
  end
end