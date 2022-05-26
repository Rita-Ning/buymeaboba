require('dotenv').config();
let assert = require('chai').assert;
let expect = require('chai').expect;
const bcrypt = require('bcrypt');
const { userProfile, chatRoom } = require('../util/mongoose');
const { getUserIdentity } = require('../server/models/user_model');
const {
  createChatroom,
  checkRoomExist,
} = require('../server/models/chat_model');
const { updateFollowerCount } = require('../server/models/creator_model');
const saltRounds = parseInt(process.env.BCRYPT_SALT);

//user signup and find test
describe('get user profile model unit test', function () {
  let password = 'rita';
  const passwordC = bcrypt.hashSync(password, saltRounds);
  let userInfo = {
    provider: 'native',
    email: 'rita@appwork.com',
    password: passwordC,
    is_admin: '0',
  };

  let user;
  it('user sign up create validation', async () => {
    user = await userProfile.create(userInfo);
  });
  it('user create validation', async () => {
    let result = await getUserIdentity(userInfo.email);
    assert.equal(
      result._id.toString(),
      user._id.toString(),
      'Both id should be identical'
    );
  });
  it('non registered email verification', async () => {
    let result = await getUserIdentity('hahaha@gmail.com');
    assert.equal(result, null, 'Return result should be null');
  });
  after(async () => {
    await userProfile.findByIdAndDelete(user._id);
  });
});

//follower count update test
describe('update user follower count unit test', function () {
  let name = 'adayacup';
  let count = 1;
  let user;
  it('get follwer count', async () => {
    user = await userProfile.findOne(
      { user_page: name },
      { follower_count: 1 }
    );
  });
  it('update follower count', async () => {
    let result = await updateFollowerCount(name, count);
    assert.equal(
      user.follower_count + 1,
      result.follower_count,
      'Follower count should be equal'
    );
  });
  it('user page is not valid', async () => {
    let result = await updateFollowerCount('notvalid', count);
    assert.equal(result, null, 'Return result should be null');
  });
  after(async () => {
    count *= -1;
    await updateFollowerCount(name, count);
  });
});

//chatroom create and find test
describe('create chatroom unit test', function () {
  let user_id = '626c1229b7da2f66cadad033';
  let member = '6266aa2f6dc20b624d2b42cb';
  let result;
  it('chatroom create', async () => {
    result = await createChatroom(user_id, member);
    expect(result.members).to.have.members([user_id, member]);
  });
  it('chatroom check validation', async () => {
    let checkRoom = await checkRoomExist(user_id, member);
    assert.equal(
      result._id.toString(),
      checkRoom._id.toString(),
      'Both id should be identical'
    );
  });
  after(async () => {
    await chatRoom.findByIdAndDelete(result._id);
  });
});
