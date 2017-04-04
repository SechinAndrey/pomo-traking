# TODO: add seed

infinite_test_user = User.find(3)

200.times{ |i|
  infinite_test_user.projects.create(title: "Projec #{i}")
}