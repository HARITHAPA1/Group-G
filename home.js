$(function(){
  // Show a highlight subset (full lists live on flights/vacations pages)
  const FLIGHTS = [
    { airline:"British Airways", flightNo:"BA117", from:"LHR", to:"JFK", departISO:"2025-08-20T10:25:00+01:00", price:549, image:"image/British way.jpg" },
    { airline:"Virgin Atlantic", flightNo:"VS301", from:"LHR", to:"DEL", departISO:"2025-08-22T20:45:00+01:00", price:619, image:"image/Virgin Atlantic.jpeg" },
    { airline:"Air France", flightNo:"AF1381", from:"LHR", to:"CDG", departISO:"2025-08-25T07:05:00+01:00", price:99, image:"image/Air France.webp" },
    { airline:"Emirates", flightNo:"EK6", from:"LHR", to:"DXB", departISO:"2025-08-28T21:10:00+01:00", price:489, image:"image/Emirates.jpg" },
  ];
  const VACATIONS = [
    { name:"Paris", discount:"10% off", image:"image/paris.jpg" },
    { name:"New York", discount:"8% off", image:"image/new york.jpeg" },
    { name:"Dubai", discount:"12% off", image:"image/dubai.jpeg" },
    { name:"Bali", discount:"15% off", image:"image/bali.jpeg" }
  ];

  const fmtMoney = n => "£"+n.toFixed(2);
  const until = iso => {
    const t = new Date(iso) - Date.now();
    if(t<=0) return "Departed";
    const d=Math.floor(t/86400000), h=Math.floor(t%86400000/3600000), m=Math.floor(t%3600000/60000);
    return `${d}d ${h}h ${m}m`;
  };

  $("#homeFlights").html(FLIGHTS.map(f=>`
    <article class="card">
      <img src="${f.image}" alt="${f.airline}">
      <div class="card-body">
        <h3>${f.airline} <span class="badge">${f.flightNo}</span></h3>
        <p>${f.from} → ${f.to}</p>
        <p class="price">${fmtMoney(f.price)}</p>
        <p>⏳ ${until(f.departISO)}</p>
      </div>
    </article>`).join(""));

  $("#homeVacations").html(VACATIONS.map(v=>`
    <article class="card">
      <img src="${v.image}" alt="${v.name}">
      <div class="card-body">
        <h3>${v.name}</h3>
        <p class="badge">${v.discount}</p>
      </div>
    </article>`).join(""));
});
