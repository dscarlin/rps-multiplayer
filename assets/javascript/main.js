 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyDPczbuDg5Sy5MCriYA5GJDVj297KqroLg",
    authDomain: "sampleproject-f0c53.firebaseapp.com",
    databaseURL: "https://sampleproject-f0c53.firebaseio.com",
    projectId: "sampleproject-f0c53",
    storageBucket: "sampleproject-f0c53.appspot.com",
    messagingSenderId: "1002525366685"
  };
firebase.initializeApp(config);
// global variables
// Get a reference to the database service
var database = firebase.database().ref();
var localArray = [], next, remain;


// This callback keeps the page updated when a value changes in firebase.
database.on("value", function(snapshot) {
	
  if (snapshot.child('databaseArray').exists()) {
		localArray = snapshot.val().databaseArray;
		loadTrains();
  } 
  else {
		localArray = [];
	}
})
//This updates the Train info every minute
setInterval(updateTrainInfo, 60*1000)
function updateTrainInfo(){
  for (i=0; i<localArray.length;i++){
    console.log('one')
    setNextTrainTimeAndTimeUntilDepart(localArray[i].time, localArray[i].freq)
    localArray[i].next = next;
    localArray[i].remain = remain;
  }
  database.set({
    databaseArray:localArray
  })
}
function setNextTrainTimeAndTimeUntilDepart(firstTrainTime,frequency){
  
    var firstTrainTimeUnix = moment(firstTrainTime, 'h:mm A').format('X');
    var currentTimeUnix = moment().format('X');
    var diffFromFirstTrainUnix = currentTimeUnix-firstTrainTimeUnix;
    var frequency = frequency*60
    var diffUntilNextTrainUnix = frequency - (diffFromFirstTrainUnix % frequency)
    var nextTrainTimeUnix = parseInt(currentTimeUnix) + diffUntilNextTrainUnix;
    var nextTrainTime = moment(nextTrainTimeUnix, 'X').format('h:mm A');
    var timeUntilDepart = moment(diffUntilNextTrainUnix, 'X').format('m');
    next = nextTrainTime;
    remain = timeUntilDepart;
}
// onClick function collecting input values
$('#submit').click(function(event) {
  event.preventDefault();
  console.log('click')
  if ($('#trainName').val() === "" || $('#destination').val() === "" || $('#firstTimeTime').val() === "" || $('#frequency').val() === "") {
		event.preventDefault();
		alert("Please fill out all form fields");

  } 
  else {
    event.preventDefault();
		var tName = $('#trainName').val();
		var tDest = $('#destination').val();
    var tTime = moment($('#firstTrainTime').val(), 'HH:mm A').format('h:mm A');
    var tfreq = $('#frequency').val()
    setNextTrainTimeAndTimeUntilDepart(tTime,tfreq)
    var tNext = next
    var tRemain = remain
		var trainObject = {
		  	name: tName,
        dest: tDest,
        freq: tfreq,
        time: tTime,
        next: tNext,
		  	remain: tRemain
		  };
		localArray.push(trainObject);
		$('#trainName').val('');
		$('#destination').val('');
    $('#firstTrainTime').val('');
    $('#frequency').val('')

		database.set({
		  databaseArray:localArray
		})

		
		loadTrains();
	}
});

//load train data from localArray to page
function loadTrains() {
  $('tbody').empty();
	for (var i = 0; i < localArray.length; i++) {

		var newData = $('<tr>');

		// newData.attr('data-index', [i]);
		newData.append("<td>"+localArray[i].name);
		newData.append("<td>"+localArray[i].dest);
		newData.append("<td>"+localArray[i].freq);
		newData.append("<td>"+localArray[i].next);
		newData.append("<td>"+localArray[i].remain);
		// newData.append("<button data-index='" + [i] + "'class='btn btn-success glyphicon' id='edit'>&#x270f;");
		// newData.append("<button data-index='" + [i] + "'class='btn btn-danger glyphicon' id='remove'>&#xe014;");

		$('tbody').append(newData);
	}


}
