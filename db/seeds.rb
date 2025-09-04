# Clear existing data in development
if Rails.env.development?
  puts "🧹 Cleaning up existing data..."
  Video.destroy_all
  Final.destroy_all
  Trait.destroy_all
  Pitch.destroy_all
  Cl.destroy_all
  Application.destroy_all
  User.destroy_all
end

puts "🌱 Creating seed data..."

# Create demo user
demo_user = User.create!(
  email: "demo@example.com",
  password: "123456",
  password_confirmation: "123456"
)
puts "👤 Created demo user: #{demo_user.email}"

# Create your user
your_user = User.create!(
  email: "anna.ullmann@gmail.com",
  password: "123456",
  password_confirmation: "123456"
)
puts "👤 Created your user: #{your_user.email}"

# Sample job descriptions - Operations focused
job_descriptions = [
  "We are seeking a Product Operations Manager to streamline our product development processes and enhance cross-functional collaboration. The ideal candidate will have 3-5 years of experience in product operations, strong analytical skills, and expertise in process optimization. You'll work closely with product, engineering, and design teams to implement scalable workflows, manage product data, and drive operational efficiency across the product lifecycle.",

  "Revenue Operations Manager position available at a fast-growing SaaS company. We need someone with expertise in sales operations, revenue analytics, and process automation. You'll be responsible for optimizing our revenue funnel, implementing sales tools, managing forecasting processes, and providing data-driven insights to drive revenue growth. Experience with Salesforce, HubSpot, and revenue analytics tools is essential.",

  "Product Manager role open for a B2B technology company. We're looking for someone with 4-6 years of product management experience, strong strategic thinking, and excellent stakeholder management skills. You'll define product roadmaps, gather customer requirements, work with engineering teams, and drive product initiatives from conception to launch. Experience with agile methodologies and user research is required.",

  "Senior Operations Manager position at an established consulting firm. We need someone with 6+ years of operations experience, process improvement expertise, and team leadership skills. You'll oversee operational workflows, implement efficiency initiatives, manage cross-functional projects, and lead a team of operations specialists. Strong analytical skills and experience with operational metrics are essential.",

  "Business Operations Analyst role at a growing fintech company. Looking for someone with 2-4 years of experience in business analysis, data analytics, and process optimization. You'll analyze business processes, identify improvement opportunities, create operational dashboards, and support strategic initiatives. Proficiency in SQL, Excel, and data visualization tools is required."
]

company_names = ["ProductFlow Inc", "RevenueMax Solutions", "InnovateTech", "OperationsFirst Consulting", "FinanceOps Pro"]

job_titles = ["Product Operations Manager", "Revenue Operations Manager", "Product Manager", "Senior Operations Manager", "Business Operations Analyst"]

# Sample traits for operations roles
sample_traits = [
  {
    first: "Professional and formal",
    second: "Analytical and data-driven approach",
    third: "Mid-level (3–5 years)",
    fourth: "Solving complex challenges"
  },
  {
    first: "Confident and assertive",
    second: "Leadership and team management",
    third: "Senior level (6–10 years)",
    fourth: "Professional growth and learning"
  },
  {
    first: "Friendly and approachable",
    second: "Communication and collaboration",
    third: "Senior level (6–10 years)",
    fourth: "Making a meaningful impact"
  },
  {
    first: "Professional and formal",
    second: "Technical expertise and problem-solving",
    third: "Expert level (10+ years)",
    fourth: "Building innovative solutions"
  },
  {
    first: "Enthusiastic and energetic",
    second: "Analytical and data-driven approach",
    third: "Mid-level (3–5 years)",
    fourth: "Working with great teams"
  }
]

# Sample generated content for operations roles
sample_cover_letters = [
  "Dear Hiring Team,\n\nI am excited to apply for the Product Operations Manager position at ProductFlow Inc. Your company's focus on streamlining product development processes and enhancing cross-functional collaboration strongly aligns with my professional experience and passion for operational excellence.\n\nIn my current role, I implemented a new product workflow system that reduced time-to-market by 30% and improved cross-team visibility. My experience includes managing product data analytics, optimizing development processes, and facilitating communication between product, engineering, and design teams. I have successfully led initiatives that resulted in more efficient product launches and better stakeholder alignment.\n\nI am particularly drawn to ProductFlow Inc because of your commitment to data-driven decision making and process innovation. I would welcome the opportunity to discuss how my analytical skills and operational expertise can contribute to your product team's success.\n\nHere you can find a short video pitch to further elaborate on my skills.\n\nSincerely,\nCandidate",

  "Dear Revenue Team,\n\nI am writing to express my strong interest in the Revenue Operations Manager position at RevenueMax Solutions. Your company's reputation for revenue growth and operational excellence makes this an ideal opportunity to apply my expertise in sales operations and revenue analytics.\n\nDuring my 5 years in revenue operations, I have successfully optimized sales funnels that increased conversion rates by 45% and implemented forecasting processes that improved accuracy by 25%. My experience includes managing Salesforce implementations, creating revenue dashboards, and developing automated workflows that streamline the entire revenue cycle. I have worked closely with sales, marketing, and customer success teams to align processes and drive consistent growth.\n\nWhat excites me most about RevenueMax Solutions is your focus on data-driven revenue strategies and process automation. I am confident that my analytical approach and operational expertise would be valuable additions to your revenue operations team.\n\nHere you can find a short video pitch to further elaborate on my skills.\n\nSincerely,\nCandidate",

  "Dear Product Team,\n\nI am thrilled to apply for the Product Manager position at InnovateTech. Your company's innovative approach to B2B technology solutions and commitment to user-centered product development strongly resonates with my product management philosophy and career goals.\n\nIn my current product management role, I led the launch of three major product features that increased user engagement by 60% and drove $2M in additional revenue. My approach involves extensive user research, data analysis, and close collaboration with engineering and design teams. I have experience managing product roadmaps, conducting stakeholder interviews, and using agile methodologies to deliver products that truly meet customer needs.\n\nI am particularly excited about InnovateTech's focus on solving complex B2B challenges through innovative technology solutions. I would love to contribute my strategic thinking and product expertise to help drive your product initiatives forward.\n\nHere you can find a short video pitch to further elaborate on my skills.\n\nSincerely,\nCandidate"
]

sample_video_pitches = [
  "~170 words\n\n[0:00] Hi, I'm excited to apply for your Product Operations Manager position. What drives me most is solving complex operational challenges that enable product teams to work more efficiently.\n\n[0:10] My strongest asset is analytical and data-driven thinking. Recently, I implemented a new product metrics dashboard that reduced reporting time by 70% and improved decision-making speed across three product teams. This involved analyzing existing workflows, identifying bottlenecks, and creating automated reporting systems.\n\n[0:35] What motivates me most is solving complex challenges because operations work directly impacts how effectively teams can deliver value to customers. When processes are optimized, everyone can focus on building great products instead of fighting inefficiencies.\n\n[0:55] I bring 4 years of mid-level experience in product operations, having worked with cross-functional teams and implemented scalable processes.\n\n[1:10] I'd love to discuss how I can help streamline your product operations. Thank you for considering my application!",

  "~175 words\n\n[0:00] Hello! I'm passionate about applying for your Revenue Operations Manager role. What energizes me most is professional growth through building systems that drive predictable revenue.\n\n[0:10] My core strength is leadership and team management. Last year, I led a revenue operations transformation that increased our forecast accuracy by 35% and reduced sales cycle length by 20%. This involved restructuring our CRM processes, training the sales team, and implementing new analytics dashboards.\n\n[0:35] Professional growth and learning motivate me because revenue operations is constantly evolving. I stay current with new tools and methodologies, and I enjoy mentoring team members to help them develop their analytical and operational skills.\n\n[0:55] As a senior-level professional with 7 years of experience, I've successfully managed revenue operations for both startups and established companies.\n\n[1:10] I'm excited to discuss how I can help optimize your revenue operations. Looking forward to our conversation!",

  "~165 words\n\n[0:00] Hi there! I'm thrilled to apply for your Product Manager position. What excites me most is making a meaningful impact by building products that solve real customer problems.\n\n[0:10] My strongest skill is communication and collaboration. Recently, I facilitated a cross-functional project that launched a new feature 2 weeks ahead of schedule, increasing user retention by 25%. This required coordinating between engineering, design, marketing, and customer success teams while maintaining clear communication throughout.\n\n[0:35] Making a meaningful impact drives everything I do because product management is about understanding customer needs and translating them into solutions that create value. When products truly serve users, it creates positive outcomes for both customers and the business.\n\n[0:55] I bring 6 years of senior-level product management experience across B2B and B2C products.\n\n[1:10] I'd love to contribute to your product strategy and roadmap. Thank you for your consideration!"
]

# Create sample applications for BOTH users
[demo_user, your_user].each do |user|
  puts "📝 Creating applications for #{user.email}..."

  5.times do |i|
    application = Application.create!(
      user: user,
      job_d: job_descriptions[i],
      name: company_names[i],
      title: job_titles[i],
      cl_status: "done",
      video_status: "done",
      cl_message: sample_cover_letters[i % sample_cover_letters.length],
      video_message: sample_video_pitches[i % sample_video_pitches.length],
      created_at: rand(30.days).seconds.ago
    )

    # Create associated records
    trait = Trait.create!(
      application: application,
      **sample_traits[i % sample_traits.length]
    )

    final = Final.create!(
      application: application,
      cl: sample_cover_letters[i % sample_cover_letters.length],
      pitch: sample_video_pitches[i % sample_video_pitches.length]
    )

    video = Video.create!(
      application: application
    )

    puts "✅ Created application: #{application.title} at #{application.name}"
  end
end

puts "\n🎉 Sample data created for both users!"
puts "🔑 Login credentials:"
puts "   Demo: demo@example.com / password123"
puts "   Your account: anna.ullmann@gmail.com / password123"
