$(document).ready(function() {

  var titleInput = $("#title");
  var amountInput =$("#amount");
  var categorySelect =$("#category");
  var descriptionInput =$("#description");
  var dateInput =$("#date");
  var paidBy =$("#paidby");
  var ul = $(".split");
  
  $("#close").on("click", function () {
    window.location.href = "/members";
  })
  function createUserli(users) {
    var newLi = $("<li>");
    newLi.data(users);
    ul.append(newLi);
  }
  
  $.get("/api/users", function(data) {
    var users= data.name[i]
    userId = data.id[i]
    var userList = [];
    for (var i = 0; i < users.length; i++) {
      userList.push(createUserli(users));
    }
  
  });
  
  var payment = amountInput / users.length;
  for(var i = 0; i < total; i++){
    $('<input/>').attr({
        'type' : 'text',
        'name' : 'sum[]'
    }).val(payment).appendTo(".split");
  }
  
  
  $("#submit-btn").on("click", function (event) {
      event.preventDefault();
      var split = $("input").val();
      if (!titleInput.val().trim() || !amountInput.val().trim() ||
          !categorySelect.val() || !descriptionInput.val() ||
          !dateInput.val().trim() || !paidBy.val().trim()) {
        return;
      }
  
      var expense = {
        title: titleInput.val().trim(),
        amount: amountInput.val().trim(),
        category: categorySelect.val(),
        description: descriptionInput.val().trim(),
        date: dateInput.val().trim(),
        paidBy: paidBy.val().trim(),
        share: split,
        UserId: userId,
      }
  
      console.log(expense)
      $.post("/api/posts/", Post, function() {
  
      
    });
      
  
  })
      
  })
    



   


