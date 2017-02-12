User.delete_all
jobs = ['Web Analytics Dev','Software Engineer','Front End dev','Backend dev','Developer Advocate','IOS dev','Android dev','Data Scientist','Sales Engineer', 'Solutions Engineer']
10.times do
  User.create(
    first_name: Faker::StarWars.character,  last_name: Faker::Name.last_name,
    job: jobs.sample ,
    email: Faker::Internet.email,
    discoverable: Faker::Boolean.boolean)
end
