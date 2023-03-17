class OutputTemplate < ::Template
  audited
  include Taxonomix
  include Authorizable

  scoped_search :on => :id, :complete_enabled => false, :only_explicit => true, :validator => ScopedSearch::Validators::INTEGER
  scoped_search :on => :name, :complete_value => true, :default_order => true
  scoped_search :on => :locked, :complete_value => {:true => true, :false => false}
  scoped_search :on => :snippet, :complete_value => {:true => true, :false => false}

  has_many :audits, :as => :auditable, :class_name => Audited.audit_class.name, :dependent => :nullify
  validates :name, :presence => true
  validates :template, :presence => true


  has_many :job_invocation_templates, dependent: :destroy
  has_many :job_invocations, through: :job_invocation_templates

end

class << self
  # we have to override the base_class because polymorphic associations does not detect it correctly, more details at
  # http://apidock.com/rails/ActiveRecord/Associations/ClassMethods/has_many#1010-Polymorphic-has-many-within-inherited-class-gotcha
  def base_class
    self
  end
  table_name = 'templates'
end
