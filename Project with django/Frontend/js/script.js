//Sidebar Toggle

var sidebarOpen = false;
var sidebar = document.getElementById("sidebar")

function openSidebar(){
    if(!sidebarOpen){
        sidebar.classList.add("sidebar-responsive");
        sidebarOpen = true;
    }
}
function closeSidebar(){
    if(sidebarOpen){
        sidebar.classList.remove("sidebar-responsive");
        sidebarOpen = false;
    }
}

//barchart
var barCharts = {
    series: [{
    data: [10, 8, 6, 4, 2]
  }],
    chart: {
    type: 'bar',
    barground: 'transparent',
    height: 350
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      horizontal: true,
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Shirts', 'Jeans', 'Watches','track pants','Casual Shoes']
  }
  };
  


  var chart = new ApexCharts(document.querySelector("#chart"), barCharts);
  chart.render();




