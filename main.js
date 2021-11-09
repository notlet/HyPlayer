// Loading screen stuff
function loadScr(showIn, showOut) {
    $('#loading-screen #loadscreentip').text(tips[rng(0, tips.length - 1)]);
    $("#rpart").css("width", "0%");
    $("#lpart").css("width", "0%");
    $("#loading-screen").show();
    if (showIn == true) {
        $("#rpart").css("width", "50%");
        $("#lpart").css("width", "50%");
        $("#loading-text").fadeIn(1000);
    };
    setTimeout(function () {
        $("#rpart").css("width", "0%");
        $("#lpart").css("width", "0%");
        if (showOut == true) {
            $("#loading-text").fadeOut(1000);
            setTimeout(function () {
                $("#loading-screen").hide();
            }, 1100);
        };
    }, 2000);
}
// end

// Misc functions
function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

function numberspacer(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function getRank() {
    if (hypixelData.player.newPackageRank == undefined) {
        return `<a style="color:#979797">Non</a>`
    } else if (hypixelData.player.newPackageRank == "VIP") {
        return `<a style="color:#00e900">VIP</a>`
    } else if (hypixelData.player.newPackageRank == "VIP_PLUS") {
        return `<a style="color:#00e900">VIP</a><a style="color:#ffd000">+</a>`
    } else if (hypixelData.player.newPackageRank == "MVP") {
        return `<a style="color:#00d9ff">MVP</a>`
    } else if (hypixelData.player.newPackageRank == "MVP_PLUS") {
        return `<a style="color:#00d9ff">MVP</a><a style="color:#ff0000">+</a>`
    }
}

function getOneTimeAchievements() {
    var oneTimeAchievementsList = ''
    for (i = 0; i < hypixelData.player.achievementsOneTime.length; i++) {
        oneTimeAchievementsList = oneTimeAchievementsList + `<option>${hypixelData.player.achievementsOneTime[i]}</option> `;
    }
    return oneTimeAchievementsList;
}

function update() {
    $('#playerSkin').attr('src', ("https://crafatar.com/renders/body/" + playerData.raw_id + "?overlay=true"))
    $('#hypixelKarma').text(numberspacer(hypixelData.player.karma));
    $('#hypixelRank').html(getRank());
    $("#oneTimeAchievementsList").html(getOneTimeAchievements())
}

function getData() {
    var player = $("#playerName").val();
    playerData = {};
    hypixelData = {};
    var request = new Request('https://playerdb.co/api/player/minecraft/' + player)
    fetch(request)
        .then(function (response) {
            if (!response.ok) {
                throw console.error(`Player ${player} does not exist!`)
            }
            return response.json();
        })
        .then(function (response) {
            playerData = response.data.player;
            console.log(`Player ${playerData.username} (${playerData.id}) found!`)
            fetch('https://api.hypixel.net/player?key=' + config.apiKey + '&uuid=' + playerData.raw_id).then(response => response.json()).then(response => {
                hypixelData = response;
                update();
            });
        });

}



// end

let config = {
    apiKey: "",
}

let hypixelData = {};
let playerData = {};
// Main Functions

function keyPlaceholderChange(element) {
    config.apiKey = $(element).val();
    saveConfig();
}

// end

// Cache

function saveConfig() {
    localStorage.setItem('config', JSON.stringify(config));
}

function loadConfig() {
    if (localStorage.getItem('config') === null) {
        cacheConfig();
    } else {
        config = JSON.parse(localStorage.getItem('config'));
        $("#apiKey").val(config.apiKey);
    }
}

// end

$(document).ready(function () {
    console.warn("Do not enter anything here if you don't know what you are doing!")
    console.log("If you want to report a bug, message LetGame#7020 on Discord!")
    loadConfig();
    let timer;
    const waitTime = 500;
    const input = document.querySelector('#playerName');
    input.addEventListener('keyup', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            getData();
        }, waitTime);
    });
});