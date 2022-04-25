const express = require('express');
var mongoose = require('mongoose');

const { userProfile, post } = require('../util/mongoose');

let userJson = require('./user_info.json');
let postJson = require('./posts_info.json');
let accountJson = require('./user_account.json');

// userJson.forEach((data) => {
//   let { user_name, profile_pic, about, category } = data;
//   let follower_count = data.followers;
//   let user_page = user_name.replace(/\s/g, '');
//   const profile = new userProfile({
//     user_name,
//     user_page,
//     profile_pic: `https://${profile_pic}`,
//     about,
//     category,
//     is_creator: '1',
//     follower_count,
//     intro_post: about,
//   });
//   profile
//     .save()
//     .then(() => {
//       console.log(profile);
//     })
//     .catch((error) => {
//       console.log('error', error);
//     });
// });

const forLoop = async (_) => {
  for (let i = 0; i < postJson.length; i++) {
    let {
      title,
      content,
      comment,
      like_count,
      author,
      created_time,
      post_tag,
    } = postJson[i];
    comment.forEach((comment) => {
      let randomUser = accountJson[(Math.random() * accountJson.length) | 0];
      comment['user_name'] = randomUser;
    });
    let create_time = new Date(created_time);
    let user_id = await userProfile
      .findOne({ user_name: author })
      .select('_id');
    const postIn = new post({
      user_id,
      title,
      content,
      create_time,
      like_count,
      comment,
      post_tag,
      content_length: content.length,
    });

    postIn
      .save()
      .then(() => {
        console.log(postIn);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
};

forLoop();
