$(document).ready(function() {

var wallet = null;
var users = new Map();
var splits = new Map();
var expenses = new Array();
var categories = null;

$.get(`api/wallets/1`, (walletInfo, status) => {
  if (status != 'success') {
    alert("Something went wrong");
  } else {
    wallet = walletInfo.wallet;
    walletInfo.wallet.Users.forEach(e => {
      users.set(e.id, { id: e.id, email: e.email, name: e.name, paid: 0.0, owes: 0.0 });
    });
    walletInfo.expenses.forEach(e => {
      users.get(e.paidBy).paid += parseFloat(e.amount);
      expenses.push(e);
    });
    walletInfo.shares.forEach(e => {

      splits.set(e.id, e.Splits);
      console.log(splits);
      e.Splits.forEach(s => {
        users.get(s.userId).owes += parseFloat(e.amount) * parseFloat(s.share);
      });
    });
    categories = wallet.category.split("|");
  }
}).then(() => {
  loadExpenses();
  loadWalletInfo();
});

function loadWalletInfo() {

  $("#walletInfo").prepend(`<h1>${wallet.title}</h1>`);

  if (wallet.public) {
    for (let user of users.values()) {
      var total;
      if (user.paid - user.owes > 0) {
        total = `<span>Is owed ${parseFloat(user.paid - user.owes).toFixed(2)}</span>`;
      } else {
        total = `<span>Owes ${parseFloat(-(user.paid - user.owes)).toFixed(2)}</span>`;
      }
      var tableLine = `<tr class="userInfo">
      <td>${user.name}</td>
      <td>${parseFloat(user.paid).toFixed(2)}</td>
      <td>${parseFloat(user.owes).toFixed(2)}</td>
      <td>${total}</td>
    </tr>`;
      $("#walletInfo table").append(tableLine);
    }
  }
}

function loadExpenses() {
  for (expense of expenses) {

    var tableLine = `<tr class="expense" data-id=${expense.id}>
         <td>${expense.title}</td>
         <td>${expense.category}</td>
         <td>${expense.date}</td>
         <td>${expense.amount}</td>
         <td>${users.get(expense.paidBy).name}</td>
       </tr>`;

    $("#expenses table").append(tableLine);
  }
};


$(document).on('click', '.expense', function (e) {
  var id = $(this).data('id');

  var expense = expenses.find(e => e.id == id);
  $('#modelTitle').text('Expense Details');
  $('#title').val(expense.title);
  $('#amount').val(expense.amount);

  for (cat of categories) {
    $('#category').append(`<option value="${cat}">${cat}</option>`);
  }
  $('#category').append(`<option>Other</option>`);
  $(`#category option[value=${expense.category}]`).attr('selected', 'selected');
  $('#description').val(expense.description);
  $('#date').val(expense.date);

  for (let [id, user] of users) {
    $('#paidBy').append(`<option data-id=${id} value="${user.name}">${user.name}</option>`);
  }

  $(`#paidBy option[value="${users.get(expense.paidBy).name}"]`).attr('selected', 'selected');

  var shares = splits.get(id);
  for (let [id, user] of users) {
    var input = $('<input>');
    input.val(shares.find(e => e.userId == id).share);
    input.attr('data-id', id);
    var shareLine = $('<tr>');
    shareLine.addClass('shareLine');
    var userName = $('<td>');
    userName.text(user.name);
    shareLine.append(userName).append(input);
    $("#split table").append(shareLine).append();
  }

  $('#modal').css('display', 'block');

  $("#submit-btn").click(e => {
    e.preventDefault();
    sendExpense(id);

  });

});


$('#addExpense').click(e => {
  e.preventDefault();
  $('#modelTitle').text('New Expense');
  for (cat of categories) {
    $('#category').append(`<option value="${cat}">${cat}</option>`);
  }
  $('#category').append(`<option>Other</option>`);

  for (let [id, user] of users) {
    $('#paidBy').append(`<option data-id=${id} value="${user.name}">${user.name}</option>`);
  }

  for (let [id, user] of users) {
    var input = $('<input>');
    input.val(parseFloat((1 / users.size).toFixed(2)));
    input.attr('data-id', id);
    var shareLine = $('<tr>');
    shareLine.addClass('shareLine');
    var userName = $('<td>');
    userName.text(user.name);
    shareLine.append(userName).append(input);
    $("#split table").append(shareLine).append();
  }

  $('#modal').css('display', 'block');

  $("#submit-btn").click(e => {
    e.preventDefault();
    sendExpense(null);

  });

});


function validateData() {

  $('#modal .red').remove();

  var valid = true;

  if ($('#title').val().trim() == '') {
    $('#title').after('<p class="red" id="titleError">Please enter a title</p>');
    valid = false;
  }

  if ($('#amount').val().trim() == '' || parseFloat($('#amount').val()) < 0.01) {
    $('#amount').after('<p class="red" id="amountError">Please enter a valid amount</p>');
    valid = false;
  }

  if ($('#description').val().trim() == '') {
    $('#description').after('<p class="red" id="descriptionError">Please enter a description</p>');
    valid = false;
  }

  if ($('#date').val().trim() == '') {
    $('#date').after('<p class="red" id="dateError">Please enter a date</p>');
    valid = false;
  }

  var sum = 0;
  $("#split table tr input").each(function (i, obj) {
    var share = parseFloat($(obj).val().trim());
    if (share < 0) {
      $(obj).parent().after('<p class="red" id="shareError">Shares must be between 0 and 1</p>');
      valid = false;
    }
    if (!isNaN(share)) {
      sum += share;
    }
  });
  if (sum < 0.98 || sum > 1.02) {
    $('#split').append('<p class="red" id="splitError">The sum of shares must equal 1</p>');
    valid = false;
  }
  return valid;
}

function sendExpense(id) {
  if (validateData()) {
    var map = new Array();
    $("#split table tr input").each(function (i, obj) {
      console.log(0 + parseFloat($(obj).val().trim()));
      var sh = isNaN(parseFloat($(obj).val().trim())) ? '0' : parseFloat($(obj).val().trim());
      map.push({ share: sh, userId: $(obj).data('id') });
    });

    var url;
    var type;
    if (id === null) {
      url = '/api/expenses/';
      type = 'POST';
    } else {
      url = `/api/expenses/${id}`;
      type = 'PUT';
    }

    $.ajax({
      url: url,
      type: type,
      data: {
        title: $('#title').val().trim(),
        amount: $('#amount').val().trim(),
        description: $('#description').val().trim(),
        category: $('#category').find(":selected").text(),
        date: $('#date').val(),
        paidBy: $('#paidBy').find(":selected").data('id'),
        walletId: wallet.id,
        map: map
      },
      success: function (resp) {
        alert('Done!');
        closeModal();
        location.reload();
      },
      error: function (err) {
        console.log(err);
        alert(err);
      }
    });
  }
}

function closeModal() {
  $('#modelTitle').text('');
  $('#title').val('');
  $('#amount').val('');
  $('#category').empty();
  $('#description').val('');
  $('#date').val('');
  $('#paidBy').empty();
  $("#split table").empty();
  $('#modal').css('display', 'none');
}


$("#close").click(e => {
  e.preventDefault();
  closeModal();
});




})












