# TODO: add seed

ap '--------- seed start ---------'
ap ''
ap '--> clean old test_user'
ap ''
User.find_by_email('test_user@mail.com')&.destroy

ap '--> create new test_user'
test_user = User.new
test_user.email = 'test_user@mail.com'
test_user.username = 'test_user'
test_user.password = '123qwe123'
test_user.password_confirmation = '123qwe123'
test_user.save

ap '--> test_user saved'
ap ''


ap '--> create new 200 test projects'
200.times{ |i|
  test_user.projects.create(title: "Projec #{i}")
}
ap '--> 200 test projects created'
ap ''

ap '--> create 10 statistics for first project'
10.times{
  test_user.projects.first.statistics.create({work_minutes: 100})
}
ap '--> 10 statistics created'
ap ''

ap '--> create 5 statistics for second project'
5.times{
  test_user.projects[1].statistics.create({work_minutes: 40})
}
ap '--> 5 statistics created'
ap ''

ap '--------- seed end ---------'
ap '--> Login Data'
ap '--> Email: test_user@mail.com'
ap '--> Password: 123qwe123'
ap ''
