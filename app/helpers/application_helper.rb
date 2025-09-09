module ApplicationHelper
  # ML Predictions Helper Methods
  def confidence_badge_color(prediction)
    return 'secondary' unless prediction&.confidence_score
    
    case prediction.confidence_score
    when 0.8..1.0
      'success'
    when 0.6..0.8
      'primary'
    when 0.4..0.6
      'warning'
    else
      'danger'
    end
  end

  def success_probability_color(probability)
    return '#6c757d' unless probability
    
    case probability
    when 0.8..1.0
      '#28a745'
    when 0.6..0.8
      '#17a2b8'
    when 0.4..0.6
      '#ffc107'
    else
      '#dc3545'
    end
  end

  def success_probability_text_color(probability)
    return 'muted' unless probability
    
    case probability
    when 0.8..1.0
      'success'
    when 0.6..0.8
      'info'
    when 0.4..0.6
      'warning'
    else
      'danger'
    end
  end

  def success_probability_level(probability)
    return 'Unknown' unless probability
    
    case probability
    when 0.8..1.0
      'Very High'
    when 0.6..0.8
      'High'
    when 0.4..0.6
      'Moderate'
    when 0.2..0.4
      'Low'
    else
      'Very Low'
    end
  end

  def confidence_level(confidence)
    return 'Unknown' unless confidence
    
    case confidence
    when 0.8..1.0
      'Very High'
    when 0.6..0.8
      'High'
    when 0.4..0.6
      'Moderate'
    when 0.2..0.4
      'Low'
    else
      'Very Low'
    end
  end

  def success_probability_alert_type(probability)
    return 'secondary' unless probability
    
    case probability
    when 0.8..1.0
      'success'
    when 0.6..0.8
      'info'
    when 0.4..0.6
      'warning'
    else
      'danger'
    end
  end

  def career_path_color(probability)
    return 'secondary' unless probability
    
    case probability
    when 0.8..1.0
      'success'
    when 0.6..0.8
      'info'
    when 0.4..0.6
      'warning'
    else
      'danger'
    end
  end

  def difficulty_badge_color(difficulty)
    return 'secondary' unless difficulty
    
    case difficulty.to_s.downcase
    when 'easy', 'low'
      'success'
    when 'medium', 'moderate'
      'warning'
    when 'hard', 'high', 'difficult'
      'danger'
    else
      'secondary'
    end
  end

  def status_badge_color(status)
    return 'secondary' unless status
    
    case status.to_s.downcase
    when 'completed', 'success'
      'success'
    when 'processing', 'pending'
      'warning'
    when 'failed', 'error'
      'danger'
    else
      'secondary'
    end
  end

  # LinkedIn Profile Analysis Helper Methods
  def profile_score_color(score)
    return '#6c757d' unless score
    
    case score
    when 90..100
      '#28a745'
    when 80..89
      '#20c997'
    when 70..79
      '#17a2b8'
    when 60..69
      '#ffc107'
    when 50..59
      '#fd7e14'
    else
      '#dc3545'
    end
  end

  def profile_score_text_color(score)
    return 'muted' unless score
    
    case score
    when 90..100
      'success'
    when 80..89
      'info'
    when 70..79
      'primary'
    when 60..69
      'warning'
    else
      'danger'
    end
  end

  def profile_score_level(score)
    return 'Unrated' unless score
    
    case score
    when 90..100
      'Excellent'
    when 80..89
      'Very Good'
    when 70..79
      'Good'
    when 60..69
      'Fair'
    when 50..59
      'Needs Improvement'
    else
      'Poor'
    end
  end

  def section_score_color(score)
    return 'secondary' unless score
    
    case score
    when 8..10
      'success'
    when 6..7
      'info'
    when 4..5
      'warning'
    else
      'danger'
    end
  end

  def priority_badge_color(priority)
    return 'secondary' unless priority
    
    case priority.to_s.downcase
    when 'high'
      'danger'
    when 'medium', 'moderate'
      'warning'
    when 'low'
      'success'
    else
      'secondary'
    end
  end

  # Currency formatting
  def format_currency(amount, currency = 'USD')
    return 'N/A' unless amount
    
    case currency&.upcase
    when 'USD'
      "$#{number_with_delimiter(amount)}"
    when 'EUR'
      "€#{number_with_delimiter(amount)}"
    when 'GBP'
      "£#{number_with_delimiter(amount)}"
    else
      "#{currency} #{number_with_delimiter(amount)}"
    end
  end

  # Industry keywords for LinkedIn optimization
  def industry_keywords
    [
      'Software Development',
      'Machine Learning',
      'Data Analysis',
      'Cloud Computing',
      'DevOps',
      'Agile',
      'Leadership',
      'Project Management',
      'Full Stack',
      'API Development',
      'Database Design',
      'User Experience',
      'Team Collaboration',
      'Problem Solving',
      'Innovation'
    ]
  end
end
