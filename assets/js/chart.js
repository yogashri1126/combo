var ctx = document.getElementById("myChart").getContext('2d');

function populateChart(searchTerm){
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(searchTerm),
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.0)',
          'rgba(54, 162, 235, 0.0)',
          'rgba(255, 206, 86, 0.0)',
          'rgba(75, 192, 192, 0.0)',
          'rgba(153, 102, 255, 1.0)',
          'rgba(255, 159, 64, 1.0)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true,
            fontSize: 20,
            fontColor: '#666',
            
          }
        }]
      }
    }
  });


}

ref.on("value", function(data){
  var keyz = firebase.auth().currentUser.uid;
  var dat = data.val();
  //array of all keys - users
  //console.log(Object.keys(dat));
  //selecting logged in user key
  var searchTerm= {};
  console.log("got here");
  for(key in dat[keyz].papers) {
    searchTerm[key] = 5;
  }

  populateChart(searchTerm);
  // console.log('chart',dat[keyz].papers);
  // populateChart()
});
