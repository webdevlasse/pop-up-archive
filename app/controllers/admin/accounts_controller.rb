class Admin::AccountsController < Admin::BaseController
  load_and_authorize_resource :class => "User"
  def index
    @accounts = @accounts.over_limits
  end

  def total_usage
    @accounts = @accounts
  end  

end
