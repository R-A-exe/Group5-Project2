$(document).ready(function() {

    var titleInput = $("#title");
    var categorySelect =$("#category");
    var public =$("#public");
    var userList = $("wallet-user-list");
    

    $("#close").on("click", function () {
        window.location.href = "/members";
      })

    $.get("/api/user_data").then(data => {
        $(".owner-name").text(data.name);
        ownerId = data.id
    });


    $.get("/api/users/").then(data => {
      for (var i = 0; i < data.length; i++) {
        var options = $("<option></option>");
        options.text(data[i].name);
        options.appendTo($("select.option-val"));
     }
  });
    
  $(".option-val").on("change", function () {
    var item = $(this).val(); 
    var newLi = $("<li>");
    newLi.text(item);
    userList.append(newLi);
  })
  
  $("#walletsub-btn").on("click", function (event) {
      event.preventDefault();
      if (!titleInput.val() || !categorySelect.val() ||
          !public.val()|| !walletUsers.val()) {
        return;
      }
  
      var wallet = {
        title: titleInput.val().trim(),
        category: categorySelect.val(),
        public: public.val(),
        ownerId:ownerId
      }
  
      console.log(wallet)
      $.post("/api/wallet", wallet, function() {
          console.log(wallet)
          window.location.href = "";
      });
  })

})
