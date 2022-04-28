let creatorPath = window.location.pathname;

axios
  .get(`/api/1.0/${creatorPath}`)
  .then((res) => {
    let data = res.data;
    //follower count need to be fixed for supporter count, now is for fake data
    let {
      user_name,
      profile_pic,
      intro_post,
      about,
      follower_count,
      post,
      popular,
    } = data;

    if (!follower_count) {
      follower_count = 0;
    }
    let profileColumn = document.getElementById('self-intro');
    let profilePic = document.getElementById('profile-pic');
    let profile = `
    <h4 class="secondfont mb-1 font-weight-bold">${user_name}</h4>
		<p class="mb-3 pl-1">${about}</p>	
		<small class="text-muted pl-1">${follower_count} followers</small>
  `;
    profileColumn.innerHTML = profile;
    let aboutColumn = document.getElementById('about');
    let aboutMe = `<p class="card-text pr-5 pl-3">${intro_post}</p>`;
    aboutColumn.innerHTML = aboutMe;

    let pic = `
  <a href="/${creatorPath}">
   <img src="${profile_pic}" class = "rounded-circle" height="100"  width="100" pt-1/>
  </a>`;
    profilePic.innerHTML = pic;

    let articleColumn = document.getElementById('article');
    let article = ``;
    //like_count should be change, this is for fake data
    post.forEach((data) => {
      let {
        title,
        description,
        content,
        comment,
        like_count,
        create_time,
        liked_by,
        _id,
      } = data;
      if (!description) {
        description = content.split('.')[0] + '.';
      }
      if (!like_count) {
        like_count = 0;
      }
      let d = new Date(create_time);
      let time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      let commentCount = comment.length;

      article += `
    <div class="mb-3 d-flex justify-content-between" >
      <div class="pr-3">
        <h2 class="mb-1 h4 font-weight-bold">
        <a class="text-dark post-title" id=${_id} href='/article/${_id}'>${title}</a>
        </h2>
        <p>
          ${description}
        </p>
        <div class="card-text text-muted small">
          ${time}
        </div>
        <small class="text-muted">  💛 &nbsp; ${like_count} &middot; ${commentCount} comments</small>
      </div>
    </div>
    `;

      let popColumn = document.getElementById('pop-article');
      let pop = ``;

      for (let i = 0; i < popular.length; i++) {
        let popularPost = popular[i];
        let d = new Date(popularPost.create_time);
        let time =
          d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
        pop += `
      <li>
      <span>
      <h6 class="font-weight-bold">
      <a href="./article.html" class="text-dark">${popularPost.title}</a>
      </h6>
      <p class="text-muted">
        ${time}
      </p>
      </span>
      </li>`;
      }
      popColumn.innerHTML = pop;

      let supportImg = document.getElementById('profile-basic');
      let supportContent = `
      <img src="${profile_pic}" id="profile-pic" alt="Avatar" class = "p-1 rounded-circle mx-auto d-block align-self-center avatar" height="95"  width="95" style="background-size:cover"/>
      <div id="support-line">	
      <h4 class="modal-title">Support <span class='font-weight-bold'>${user_name}</span>&nbsp&nbsp:)</h4>
      <button type="button" class="close mr-1 pr-1" data-dismiss="modal" aria-hidden="true" onclick='recoverForm()'>&times;</button>
      </div>`;
      supportImg.innerHTML = supportContent;
    });
    articleColumn.innerHTML = article;
  })
  .catch((error) => {
    console.log(error);
  });

//Tap pay
TPDirect.setupSDK(
  12348,
  'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF',
  'sandbox'
);
TPDirect.card.setup({
  fields: {
    number: {
      element: '.form-control.card-number',
      placeholder: 'card number: **** **** **** ****',
    },
    expirationDate: {
      element: document.getElementById('tappay-expiration-date'),
      placeholder: 'expiration day: MM / YY',
    },
    ccv: {
      element: $('.form-control.cvc')[0],
      placeholder: 'cvc / 3 digit',
    },
  },
  styles: {
    input: {
      color: 'gray',
    },
    ':focus': {
      color: 'black',
    },
    '.valid': {
      color: 'green',
    },
    '.invalid': {
      color: 'red',
    },
    '@media screen and (max-width: 400px)': {
      input: {
        color: 'orange',
      },
    },
  },
});

// listen for TapPay Field
TPDirect.card.onUpdate(function (update) {
  /* Disable / enable submit button depend on update.canGetPrime  */
  /* ============================================================ */

  // update.canGetPrime === true
  //     --> you can call TPDirect.card.getPrime()
  // const submitButton = document.querySelector('button[type="submit"]')
  if (update.canGetPrime) {
    // submitButton.removeAttribute('disabled')
    $('button[type="submit"]').removeAttr('disabled');
  } else {
    // submitButton.setAttribute('disabled', true)
    $('button[type="submit"]').attr('disabled', true);
  }

  /* Change card type display when card type change */
  /* ============================================== */

  // cardTypes = ['visa', 'mastercard', ...]
  var newType = update.cardType === 'unknown' ? '' : update.cardType;
  $('#cardtype').text(newType);

  /* Change form-group style when tappay field status change */
  /* ======================================================= */

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    setNumberFormGroupToError('.card-number-group');
  } else if (update.status.number === 0) {
    setNumberFormGroupToSuccess('.card-number-group');
  } else {
    setNumberFormGroupToNormal('.card-number-group');
  }

  if (update.status.expiry === 2) {
    setNumberFormGroupToError('.expiration-date-group');
  } else if (update.status.expiry === 0) {
    setNumberFormGroupToSuccess('.expiration-date-group');
  } else {
    setNumberFormGroupToNormal('.expiration-date-group');
  }

  if (update.status.cvc === 2) {
    setNumberFormGroupToError('.cvc-group');
  } else if (update.status.cvc === 0) {
    setNumberFormGroupToSuccess('.cvc-group');
  } else {
    setNumberFormGroupToNormal('.cvc-group');
  }
});

$('form').on('submit', function (event) {
  event.preventDefault();

  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  console.log(tappayStatus);
  let token = localStorage.getItem('token');

  // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
  if (tappayStatus.canGetPrime === false) {
    alert('can not get prime');
    return;
  }

  // if (!token) {
  //   window.location.replace('/profile.html');
  //   alert('Please sign in first');
  //   return;
  // }
  let supporterInfo;
  let supportAmount = JSON.parse(localStorage.getItem('support_amount'));
  let supporter = JSON.parse(localStorage.getItem('supporter_info'));
  let creator = creatorPath.replace('/creator/', '');
  if (supporter) {
    supporterInfo = supporter;
  } else {
    supporterInfo = localStorage.getItem('user_info');
  }

  // Get prime
  TPDirect.card.getPrime(function (result) {
    if (result.status !== 0) {
      alert('get prime error ' + result.msg);
      return;
    }
    let prime = result.card.prime;

    let supportInfo = {
      prime: prime,
      amount: supportAmount,
      user: supporterInfo,
      creator,
    };

    localStorage.removeItem('supporter_info');
    localStorage.removeItem('support_amount');

    console.log(supportInfo);

    axios({
      method: 'post',
      url: '/api/1.0/support/checkout',
      data: JSON.stringify(supportInfo),
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res);
        thankMsg();
      })
      .catch(function (err) {
        console.log(err);
        // msg = err.response.data.error;
        // localStorage.removeItem('token');
        // alert(msg);
      });
  });
});

function thankMsg() {
  let thanks = document.getElementById('support-line');
  let thankMsg = `
  <h4 class="modal-title">Thank you for your support ! &nbsp&nbsp:)</h4>	
  <button type="button" class="close mr-1 mb-4 pr-1" data-dismiss="modal" aria-hidden="true">&times;</button>
  `;
  thanks.innerHTML = thankMsg;
  document.getElementById('support-form').innerHTML = ``;
}

function setNumberFormGroupToError(selector) {
  $(selector).addClass('has-error');
  $(selector).removeClass('has-success');
}

function setNumberFormGroupToSuccess(selector) {
  $(selector).removeClass('has-error');
  $(selector).addClass('has-success');
}

function setNumberFormGroupToNormal(selector) {
  $(selector).removeClass('has-error');
  $(selector).removeClass('has-success');
}
