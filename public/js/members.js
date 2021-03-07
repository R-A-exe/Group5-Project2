
var wallet = null;
var users = new Map();
var expenses = new Array();
var categories;

$.get(`api/wallets/1`, (walletInfo, status) => {
  if (status != 'success') {
    alert("Something went wrong");
  } else {
    wallet = walletInfo.wallet;
    walletInfo.wallet.Users.forEach(e=> {
        users.set(e.id, e);
    });;
    expenses = [...walletInfo.expenses];
    categories = wallet.category.split("|")
  }
}).then(() => {
  loadExpenses();
  loadWalletInfo();
});

function loadWalletInfo() {
  $("#walletInfo").append(`<h1>${wallet.title}</h1>`)
  if (wallet.public) {
    $("#walletInfo").append(`<p>${wallet.title} is shared with</p>`);
    for (let user of users.values()) {
      $("#walletInfo").append(`<p>${user.name}</p>`);
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
         <td>${users.get(expense.paidById).name}</td>
       </tr>`;

    $("#expenses table").append(tableLine);
  }
};


$(document).on('click', '.expense', function (e) {
  var id = $(this).data('id');
  $.get(`/api/expense/${id}`, (expenseInfo, expStatus) => {
    if (expStatus != 'success') {
      alert("Something went wrong");
    } else {
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
      $(`#paidBy option[value="${users.get(expense.paidById)}"]`).attr('selected', 'selected');
      for (let [id, user] of users) {
        var input = $('<input>');
        input.val(expenseInfo.find(e=>e.UserId==id).share);
        input.attr('data-id', id);
        var shareLine = $('<tr>');
        shareLine.addClass('shareLine');
        var userName = $('<td>');
        userName.text(user.name);
        shareLine.append(userName).append(input);
        $("#split table").append(shareLine).append();
      }
      $('#modal').css('display', 'block');
    }
  });

  $("#submit-btn").click(e => {
    e.preventDefault();
    sendExpense(id);

  });

});


$('#addExpense').click(e=>{
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
    input.val(parseFloat((1/users.size).toFixed(2)));
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

  if ($('#amount').val().trim()=='' || parseInt($('#amount').val()) < 0.01) {
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
    if(!isNaN(share)){
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
      console.log(0+parseFloat($(obj).val().trim()));
      var sh = isNaN(parseFloat($(obj).val().trim()))? '0' : parseFloat($(obj).val().trim());
      map.push({ share: sh, userId: $(obj).data('id') });
    });

    var url;
    var type;
    if(id===null){
        url = '/api/expense/';
        type = 'POST';
    }else{
      url = `/api/expense/${id}`;
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
        paidById: $('#paidBy').find(":selected").data('id'),
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

















