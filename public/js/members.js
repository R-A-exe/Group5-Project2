$(document).ready(() => {

    getWallets();

    // GET request to load member name and email
    $.get("/api/user_data").then(data => {
        $(".member-name").text(data.name);
        $(".member-email").text(data.email);
    });
    
    //////Add new wallet modal//////
    var title = $("#wallet-title");
    userEmail();

   $("#close").on("click", function () {
        closeModal();
      });
    
    $("#cat-btn").click(function(e){
        e.preventDefault();
        catInput = $("input#wallet-cat").val().trim();
        var catli =$("<li id='cat'>");
        catli.text(catInput);
        $("#cat-list").append(catli);
        $("input#wallet-cat").val("")
    })
    
    var emailArr =[];
    function userEmail(){
        $("#user-btn").click(function(e){
        e.preventDefault();
        emailInput = $("input#user-email").val();
        emailArr.push(emailInput)
    
        var list = "";
        for(var i=0; i < emailArr.length; i++){
            list +="<li id='user'>"+emailArr[i]+"</li>";
        }
            $("#user-list").append(list);
            $("input#user-email").val("")
        })
    }

    $("#walletsub-btn").on("click", function (event) {
    event.preventDefault();
    alert("test")
      createWallet();
      closeModal();
      location.reload();
    })

    function createWallet() {
    var wallet = {
        title: title.val().trim(),
        category: $("input#wallet-cat").val(),
        public:  $('#exampleRadios1').is(':checked'),
      }

      console.log(wallet)

      $.post("/api/wallet", wallet, function() {
          closeModal();
      });
  
    }

    function closeModal() {
        $("input#wallet-title").val('');
        $("#cat").remove();
        $("#user").remove();
        emailArr = [];
        $('#exampleModal').css('display', 'none');
    }

    //////Add new wallet end//////

    //////Wallets//////

    //Get user wallets
    function getWallets() {
        $.get("/api/wallets/", function(data) {
        var public = data.public;
        var private = data.private

        for (var i = 0; i < public.length; i++) {
            if (public[i].title == null){
                return
            } else {
            var newDiv = $("<div id='card-body'>");
            var viewBtn = $("<button class='btn btn-primary pub-view' id='view'>");
            var updateBtn = $("<button class='btn btn-primary pub-update' id='update'>");
            viewBtn.text("view")
            updateBtn.text("update")
            newDiv.append("<h6 class='d-flex align-items-center mb-3'><i class='material-icons text-info mr-2'>Wallet</i> - Public</h6>",
                          "<h4>" + public[i].title +"</h4>",
                          "<p>" + public[i].category +"</p>",
                          updateBtn, viewBtn)
                $("#card").append(newDiv)
            }
        }
        
        for (var i = 0; i < private.length; i++) {
            if (private[i].title == null){
                return
            } else {
            var newDiv = $("<div id='card-body'>");
            var viewBtn = $("<button class='btn btn-primary pri-view' id='view'>");
            var updateBtn = $("<button class='btn btn-primary pri-update' id='update'>");
            viewBtn.text("view")
            updateBtn.text("update")
            newDiv.append("<h6 class='d-flex align-items-center mb-3'><i class='material-icons text-info mr-2'>Wallet</i> - Private</h6>",
                          "<h4>" + private[i].title +"</h4>",
                          "<p>" + private[i].category +"</p>",
                          updateBtn, viewBtn);
                $("#card").append(newDiv)
                }
            }
        })
         

    }
    //View Wallet
    $(document).on('click', "#view", function() {
        location.href ="wallet.html"
    })

    $(document).on('click', "#update", function() {
        
    })
    


})







    


    
    
    
        
        

        
    
        
          
         
        
  
        












    

