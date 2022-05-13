let userId = localStorage.getItem('user_info');

function recoverForm() {
  let form = document.getElementById('form-content');
  let content = ``;
  content = `
  <div class="d-flex align-items-center justify-content-center mb-5 mt-3 form-group">
    <h3 class="mb-0 text-warning">$</h3>
    <input type="text" class="form-control border-0 text-primary" placeholder="amount" style="height:40px ; width:80px" id="withdraw-input" required="required">		
  </div>
  <div id="card-choose" class=>
    <div class="mb-2 text-warning">Withdraw With</div>	
    <div class="form-group justify-content-center">
        <button type="submit" class="btn btn-dark btn-block rounded-pill mt-2  col-sm-6" onclick="withdrawBank()">Bank Account</button>
        <button type="submit" class="btn btn-dark btn-block rounded-pill mt-2  col-sm-6" onclick="withdrawLine()">Line Pay</button>
    </div>
  </div>`;
  form.innerHTML = content;
}

function withdrawBank() {
  let withdraw = document.getElementById('withdraw-input').value;
  if (!withdraw || withdraw <= 0 || withdraw > ttlEarning) {
    alert('Please Enter valid amount!');
    return;
  }

  axios({
    method: 'post',
    url: '/api/1.0/withdraw',
    data: {
      user_id: userId,
      method: 'bank',
      amount: parseInt(withdraw),
    },
  })
    .then((res) => {
      if (res.data.data == 'not-create') {
        createBankForm();
      }
      if (res.data.data == 'success') {
        let form = document.getElementById('form-content');
        let sucessMsg = ``;
        sucessMsg = `
        <h5 class="pt-2 text-warning">Withdraw Sucess!</h5>
        `;
        form.innerHTML = sucessMsg;
        setTimeout(() => {
          location.reload();
        }, '3000');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
function createBankForm() {
  let form = document.getElementById('form-content');
  let bankAccount = '';
  bankAccount = `
  <h5 class="pt-2 text-warning">Bank Account Info</h5>
  <div id="card-form">		
      <div class="form-group pt-4">
          <input type="text" class="form-control" placeholder="Account holder name" style="height:40px" required="required">		
      </div>
      <div class="form-group pt-2 ">
          <input type="text pt-1" class="form-control" placeholder="ACH routing number" style="height:40px" required="required">	
      </div> 
      <div class="form-group pt-2">
          <input type="text" class="form-control" placeholder="Account number" style="height:40px" id="acoount-number" required="required">		
      </div>
      <div class="form-group pt-2">
          <input type="text" class="form-control" placeholder="ID number" style="height:40px" required="required">		
      </div> 
      <div class="form-group pt-4 pb-4 d-flex justify-content-center rounded-pill">
          <button type="submit" class="btn btn-dark payBtn col-sm-6" onclick='saveBank()'>save</button>
      </div>
  </div>`;
  form.innerHTML = bankAccount;
}

function withdrawLine() {
  let withdraw = document.getElementById('withdraw-input').value;
  if (!withdraw || withdraw <= 0 || withdraw > ttlEarning) {
    alert('Please Enter valid amount!');
    return;
  }

  axios({
    method: 'post',
    url: '/api/1.0/withdraw',
    data: {
      user_id: userId,
      method: 'linepay',
      amount: parseInt(withdraw),
    },
  })
    .then((res) => {
      if (res.data.data == 'not-create') {
        createLineForm();
      }
      if (res.data.data == 'success') {
        let form = document.getElementById('form-content');
        let sucessMsg = ``;
        sucessMsg = `
        <h5 class="pt-2 text-warning">Withdraw Sucess!</h5>
        `;
        form.innerHTML = sucessMsg;
        setTimeout(() => {
          location.reload();
        }, '3000');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
function createLineForm() {
  let form = document.getElementById('form-content');
  let lineAccount = '';
  lineAccount = `
  <h5 class="pt-2 text-warning">Line Account Info</h5>
  <div id="card-form">		
      <div class="form-group pt-4">
          <input type="text" class="form-control" placeholder="Line Account ID" style="height:40px" id="line-acoount" required="required">		
      </div>
      <div class="form-group pt-4 pb-4 d-flex justify-content-center rounded-pill">
          <button type="submit" class="btn btn-dark payBtn col-sm-6" onclick='saveLine()'>save</button>
      </div>
  </div>`;
  form.innerHTML = lineAccount;
}

function saveBank() {
  let accountNumber = document.getElementById('acoount-number').value;
  axios({
    method: 'post',
    url: '/api/1.0/billing',
    data: {
      user_id: userId,
      method: 'bank',
      account_num: accountNumber,
    },
  })
    .then((res) => {
      // console.log(res.data);
      if ((res.data.data = 'success')) {
        let form = document.getElementById('form-content');
        let sucessMsg = ``;
        sucessMsg = `
      <h5 class="pt-2 text-warning">Bank Account Create !</h5>
      `;
        form.innerHTML = sucessMsg;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function saveLine() {
  let accountNumber = document.getElementById('line-acoount').value;
  axios({
    method: 'post',
    url: '/api/1.0/billing',
    data: {
      user_id: userId,
      method: 'linepay',
      account_num: accountNumber,
    },
  })
    .then((res) => {
      // console.log(res.data);
      if ((res.data.data = 'success')) {
        let form = document.getElementById('form-content');
        let sucessMsg = ``;
        sucessMsg = `
      <h5 class="pt-2 text-warning">Line Account Create !</h5>
      `;
        form.innerHTML = sucessMsg;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//history withdraw transaction
let ttlEarning;
axios({
  method: 'post',
  url: '/api/1.0/balance',
  data: {
    user_id: userId,
  },
})
  .then((res) => {
    let { total, withdraw, transaction } = res.data;
    ttlEarning = total;
    let ttl_box = document.getElementById('total-earning');
    let ttl = `<h6 class="mb-0"> &nbsp $${total}</h6>`;
    ttl_box.innerHTML = ttl;

    let balance_amount = total - withdraw;
    let balance_box = document.getElementById('balance');
    let balance = `<h6 class="mb-0"> &nbsp $${balance_amount}</h6>`;
    balance_box.innerHTML = balance;

    let transaction_history = document.getElementById('transaction-history');
    let history = ``;

    transaction.reverse().forEach((ele) => {
      let d = new Date(ele.time);
      let time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      let status;
      // console.log(ele.receive_time);
      if (ele.receive_time < Date.now()) {
        status = 'transaction success';
      } else {
        status = 'transaction pending';
      }
      history += `
      <div class="d-flex align-items-center border-bottom py-3">
          <div class="w-100 ms-3">
              <div class="d-flex w-100 justify-content-between pb-1">
                <div class ='d-flex'>
                  <h6 class="mb-0 text-secondary">${ele.method.toUpperCase()} </h6>
                  <small>&nbsp ************${ele.account_num}</small>
                </div>
                  <small>${time}</small>
              </div>
              <span class="text-dark">$${ele.amount}</span>
              <div><small class="text-primary">${status}</small></div>
          </div>
      </div>`;
    });
    transaction_history.innerHTML = history;
  })
  .catch(function (error) {
    console.log(error);
  });
