class Activities

  def initialize activity, current_user, params
    @type = activity
    @selected_project = params[:selected_project] if params[:selected_project]
    makeActivities current_user
  end

  def makeActivities current_user
    case @type
      when 'all_time'
        makeAllTime current_user
      when 'last_month'
        makeLastMonth current_user
      when 'last_project'
        makeLastProject current_user
      when 'selected_project'
        makeSelectedProject
      else
        ap 'Wrong activity'
    end
  end

  def makeAllTime current_user
    # ap current_user.projects.includes(:pomo_cycle)
  end

  def makeLastMonth current_user
  end

  def makeLastProject current_user
  end

  def makeSelectedProject
  end
end