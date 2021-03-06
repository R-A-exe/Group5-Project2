$(document).ready(function () {

  //Get query string value
  const urlParams = new URLSearchParams(window.location.search);
  var id = urlParams.get('id');

  var wallet = null;
  var users = new Map();
  var splits = new Map();
  var expenses = new Array();
  var categories = new Map();
  var totalExpenses = null;
  var settleExpense = new Map();

  //GET request to get wallets by id
  $.get(`api/wallets/${id}`, (walletInfo, status) => {
    if (status != 'success') {
      alert("Something went wrong");
    } else {
      wallet = walletInfo.wallet;
      if (walletInfo.wallet.Users.length > 0) {
        walletInfo.wallet.Users.forEach(e => {
          users.set(e.id, { id: e.id, email: e.email, name: e.name, paid: 0.0, owes: 0.0, settled: 0.0 });
        });
      }

      wallet.category.split("|").forEach(e => {
        if (e != '') categories.set(e, { category: e, total: 0.0 });
      });
      categories.set('Other', { category: 'Other', total: 0.0 });
      categories.set('Settling Balance', { category: 'Settling Balance' });

      if (walletInfo.expenses.length > 0) {
        walletInfo.expenses.forEach(e => {
          if (e.category != 'Settling Balance') {
            users.get(e.paidBy).paid += parseFloat(e.amount);
            totalExpenses += parseFloat(e.amount);
            var cat = categories.get(e.category);
            cat.total += parseFloat(e.amount);
          } else {
            users.get(e.paidBy).settled += parseFloat(e.amount);
            settleExpense.set(e.id, e.amount);
          }
          expenses.push(e);
        });
      }


      if (walletInfo.shares.length > 0) {
        walletInfo.shares.forEach(e => {
          splits.set(e.id, e.Splits);
          if (!settleExpense.get(e.id)) {
            e.Splits.forEach(s => {
              users.get(s.userId).owes += (parseFloat(e.amount) * parseFloat(s.share));
            });
          }
        });
      }

      if (settleExpense.size > 0) {
        for (let [key, value] of settleExpense) {
          splits.get(key).forEach(s => {
            users.get(s.userId).settled += (-parseFloat(value) * parseFloat(s.share));
          });
        };
      }

      adsuw = walletInfo.me;

    }

  }).then(() => {
    loadExpenses();
    loadWalletInfo();
  });

  //function to load wallet info
  function loadWalletInfo() {

    $("#walletBox h1").text(wallet.title);

    if (wallet.public) {
      for (let user of users.values()) {
        var total;
        if (user.paid - user.owes > 0) {
          total = `<span>Is owed ${parseFloat(user.paid - user.owes + user.settled).toFixed(2)}</span>`;
        } else {
          total = `<span>Owes ${parseFloat(-(user.paid - user.owes + user.settled)).toFixed(2)}</span>`;
        }
        var tableLine = `<tr class="userInfo">
      <td>${user.name}</td>
      <td>${parseFloat(user.paid).toFixed(2)}</td>
      <td>${parseFloat(user.owes).toFixed(2)}</td>
      <td>${parseFloat(user.settled).toFixed(2)}</td>
      <td>${total}</td>
    </tr>`;
        $("#walletInfo table").append(tableLine);
      }
    }

    if (totalExpenses) {
      $('#total p').text(`$${parseFloat(totalExpenses).toFixed(2)}`)
    } else {
      $('#total p').text(`$0.00`)
    }

    if (expenses.length == 0) {
      $('#costChart').append('<h2>Breakdown by categories</h2>');
      $('#costChart').append('<p>You have no expenses</p>');
    } else {
      drawChart();
    }
  }

  //Function to load expenses in table.
  function loadExpenses() {
    for (expense of expenses) {

      var tableLine = `<tr class="expense" data-id=${expense.id}>
         <td>${expense.title}</td>
         <td class="hide">${expense.category}</td>
         <td>${expense.date}</td>
         <td>$${parseFloat((expense.amount)).toFixed(2)}</td>
         <td>${users.get(expense.paidBy).name}</td>
       </tr>`;

      $("#expenses table").append(tableLine);
    }
  };

  //Click event to get the expense update modal
  $(document).on('click', '.expense', function (e) {
    try {
      var id = $(this).data('id');

      var expense = expenses.find(e => e.id == id);
      $('#modelTitle').text('Expense Details');
      $('#title').val(expense.title);
      $('#amount').val(expense.amount);


      for (let [key, value] of categories) {
        $('#category').append(`<option value="${key}">${key}</option>`);
      }
      $(`#category option[value="${expense.category}"]`).attr('selected', 'selected');
      $('#description').val(expense.description);
      $('#date').val(expense.date);

      for (let [id, user] of users) {
        $('#paidBy').append(`<option data-id=${id} value="${user.name}">${user.name}</option>`);
      }

      $(`#paidBy option[value="${users.get(expense.paidBy).name}"]`).attr('selected', 'selected');

      var shares = splits.get(id);
      for (let [id, user] of users) {
        var input = $('<input>');
        var share = shares.find(e => e.userId == id)
        if (share) {
          input.val(share.share);
        } else {
          input.val(0.0);
        }

        input.attr('data-id', id);
        var shareLine = $('<tr>');
        shareLine.addClass('shareLine');
        var userName = $('<td>');
        userName.text(user.name);
        shareLine.append(userName).append(input);
        $("#split table").append(shareLine).append();
      }

      $('#modal').css('display', 'block');

      //Click event to submit updated modal info
      $("#submit-btn").click(e => {
        e.preventDefault();
        sendExpense(id);

      });
    } catch (err) {
      console.log(err);
      closeModal();
    }

  });
  var adsuw = null;
  //click event to dispaly modal to add an expense
  $('#addExpense').click(e => {
    e.preventDefault();
    $('#modelTitle').text('New Expense');
    for (let [key, value] of categories) {
      $('#category').append(`<option value="${key}">${key}</option>`);
    }

    for (let [id, user] of users) {
      $('#paidBy').append(`<option data-id=${id} value="${user.name}">${user.name}</option>`);
    }
    $(`#paidBy option[value="${users.get(adsuw).name}"]`).attr('selected', 'selected');

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

    //click event to send data to server
    $("#submit-btn").click(e => {
      e.preventDefault();
      sendExpense(null);

    });

  });

  //Function to validate data in expense modal
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

  //function to create or update expenses.
  function sendExpense(id) {
    if (validateData()) {
      var map = new Array();
      $("#split table tr input").each(function (i, obj) {
        var sh = isNaN(parseFloat($(obj).val().trim())) ? '0.0' : parseFloat($(obj).val().trim());
        map.push({ share: sh, userId: $(obj).data('id') });
      });

      var url;
      var type;
      //if conditional to for post or put request
      if (id === null) {
        url = '/api/expenses/';
        type = 'POST';
      } else {
        url = `/api/expenses/${id}`;
        type = 'PUT';
      }

      //Ajax call for data
      $.ajax({
        url: url,
        type: type,
        data: {
          title: $('#title').val().trim(),
          amount: parseFloat($('#amount').val().trim()),
          description: $('#description').val().trim(),
          category: $('#category').find(":selected").text(),
          date: $('#date').val(),
          paidBy: $('#paidBy').find(":selected").data('id'),
          walletId: wallet.id,
          map: map
        },
        success: function (resp) {
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

  //Function to close and clear input field of the modal
  function closeModal() {
    $("#submit-btn").off('click');
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

  //click event to close modal when the close button is clicked
  $("#close").click(e => {
    e.preventDefault();
    closeModal();
  });

  //Google Chart
  function drawChart() {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(loadChart);
    function loadChart() {
      var arrOfArrs = [['Expenses', 'CAD']];
      categories.forEach((el) => {
        if (el.category != 'Settling Balance') arrOfArrs.push([el.category, el.total]);
      });
      var data = google.visualization.arrayToDataTable(arrOfArrs);
      var chartWidth = document.getElementById('costChart').offsetWidth;
      var options = {
        width: (chartWidth - 150), height: (chartWidth - 150), legend: { position: 'bottom', alignment: 'center' }, pieSliceText: 'value', chartArea: { width: "80%" }
      };
      var chart = new google.visualization.PieChart(document.getElementById("costChart"));
      chart.draw(data, options);
      $('#costChart').prepend('<h2>Breakdown by categories</h2>');
    }
  }

  //resize google chart with window
  $(window).on('resize', function () {
    $("#costChart").empty();
    drawChart();
  });





})












