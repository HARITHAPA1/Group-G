$(function(){
  /* ===== 10 real-looking flights from London ===== */
  const FLIGHTS = [
    { id:"BA117-2025-08-20", airline:"British Airways", flightNo:"BA117", from:"LHR", to:"JFK", departISO:"2025-08-20T10:25:00+01:00", price:549, image:"image/British way.jpg" },
    { id:"VS301-2025-08-22", airline:"Virgin Atlantic", flightNo:"VS301", from:"LHR", to:"DEL", departISO:"2025-08-22T20:45:00+01:00", price:619, image:"image/Virgin Atlantic.jpeg" },
    { id:"AF1381-2025-08-25", airline:"Air France", flightNo:"AF1381", from:"LHR", to:"CDG", departISO:"2025-08-25T07:05:00+01:00", price:99, image:"image/Air France.webp" },
    { id:"EK6-2025-08-28", airline:"Emirates", flightNo:"EK6", from:"LHR", to:"DXB", departISO:"2025-08-28T21:10:00+01:00", price:489, image:"image/Emirates.jpg" },
    { id:"LH915-2025-08-23", airline:"Lufthansa", flightNo:"LH915", from:"LHR", to:"FRA", departISO:"2025-08-23T06:30:00+01:00", price:129, image:"image/lufthansa.jpeg" },
    { id:"QR4-2025-08-27", airline:"Qatar Airways", flightNo:"QR4", from:"LHR", to:"DOH", departISO:"2025-08-27T16:00:00+01:00", price:399, image:"image/Qatar Airways.webp" },
    { id:"UA931-2025-08-24", airline:"United Airlines", flightNo:"UA931", from:"LHR", to:"SFO", departISO:"2025-08-24T11:15:00+01:00", price:599, image:"image/united airlines.jpeg" },
    { id:"AA101-2025-08-26", airline:"American Airlines", flightNo:"AA101", from:"LHR", to:"JFK", departISO:"2025-08-26T09:30:00+01:00", price:539, image:"image/american airlines.jpeg" },
    { id:"SQ319-2025-08-29", airline:"Singapore Airlines", flightNo:"SQ319", from:"LHR", to:"SIN", departISO:"2025-08-29T22:05:00+01:00", price:799, image:"image/singapore airlines.jpeg" },
    { id:"KL1008-2025-08-21", airline:"KLM", flightNo:"KL1008", from:"LHR", to:"AMS", departISO:"2025-08-21T08:40:00+01:00", price:89, image:"image/klm.jpeg" }
  ];

  /* ===== Auth ===== */
  const Auth = {
    _users(){ return JSON.parse(localStorage.getItem("users")||"{}"); },
    current(){ return sessionStorage.getItem("signedInEmail"); }
  };

  /* ===== Tickets storage ===== */
  const getTickets = ()=> JSON.parse(localStorage.getItem("tickets")||"[]");
  const saveTickets = (list)=> localStorage.setItem("tickets", JSON.stringify(list));

  /* ===== Utils ===== */
  const fmtMoney = n => "£"+n.toFixed(2);
  const until = iso => {
    const t = new Date(iso) - Date.now();
    if(t<=0) return "Departed";
    const d=Math.floor(t/86400000), h=Math.floor(t%86400000/3600000), m=Math.floor(t%3600000/60000);
    return `${d}d ${h}h ${m}m`;
  };
  const successIcon = () => `
    <span class="ok">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#00d1b2" stroke-width="2"/>
        <path d="M7 12.5l3.2 3.2L17 9" stroke="#00d1b2" stroke-width="2"/>
      </svg>
    </span>`;
  function toast(msg, withIcon=false){
    const el=$("#toast"); el.html(withIcon?successIcon()+msg:msg).addClass("show");
    setTimeout(()=> el.removeClass("show").empty(), 2200);
  }

  /* ===== Render ===== */
  function renderFlights(list){
    $("#flightsList").html(list.map(f=>`
      <article class="card">
        <img src="${f.image}" alt="${f.airline}">
        <div class="card-body">
          <h3>${f.airline} <span class="badge">${f.flightNo}</span></h3>
          <p>${f.from} → ${f.to}</p>
          <p class="price">${fmtMoney(f.price)}</p>
          <p>⏳ ${until(f.departISO)}</p>
          <button class="btn buy" data-id="${f.id}">Buy ticket</button>
        </div>
      </article>`).join(""));
    $(".buy").off("click").on("click", openDrawer);
  }
  renderFlights(FLIGHTS);

  /* ===== Filters ===== */
  $("#applyFilters").on("click", ()=>{
    const from=$("#filterFrom").val().toUpperCase().trim();
    const to=$("#filterTo").val().toUpperCase().trim();
    renderFlights(FLIGHTS.filter(f =>
      (!from || f.from.includes(from)) && (!to || f.to.includes(to))
    ));
  });
  $("#clearFilters").on("click", ()=>{ $("#filterFrom,#filterTo").val(""); renderFlights(FLIGHTS); });

  /* ===== Drawer buy flow ===== */
  function openDrawer(){
    const id=$(this).data("id");
    const f=FLIGHTS.find(x=>x.id===id);

    if(!Auth.current()){ location.href="auth.html"; return; }

    $("#drawerTitle").text(`${f.airline} ${f.flightNo}`);
    $("#drawer").attr("open", true);

    $("#buyForm").off("submit").on("submit", function(e){
      e.preventDefault();
      const name = $("#fullName").val().trim();
      const cardNo = $("#cardNo").val().replace(/\D/g,""); // accept digits only
      const sort   = $("#sortCode").val().replace(/\D/g,"");

      if(!name || cardNo.length!==16 || sort.length!==6){
        toast("Enter full name, 16-digit card and 6-digit sort code");
        return;
      }

      const ticket={ type:"flight", ref:`SF${Date.now()}`, name,
        airline:f.airline, flightNo:f.flightNo, from:f.from, to:f.to, departISO:f.departISO };
      const list=getTickets(); list.push(ticket); saveTickets(list);

      $("#drawer").removeAttr("open");
      toast("Ticket purchased successfully!", true);
      setTimeout(()=> location.href="tickets.html", 1100);
    });
  }
  $(".drawer-close").on("click", ()=> $("#drawer").removeAttr("open"));
});
