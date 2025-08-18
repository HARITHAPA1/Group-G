$(function(){
  /* ===== 10 vacation places (each mapped to a real-looking flight) ===== */
  const VACATIONS = [
    { id:"PARIS",     name:"Paris (France)",        code:"LOVE10",  discount:"10% off",  image:"image/paris.jpg",
      airline:"Air France",       flightNo:"AF1381", from:"LHR", to:"CDG", departISO:"2025-08-25T07:05:00+01:00", price:159 },
    { id:"NEWYORK",   name:"New York (USA)",        code:"NYC08",   discount:"8% off",   image:"image/new york.jpeg",
      airline:"British Airways",  flightNo:"BA117",  from:"LHR", to:"JFK", departISO:"2025-08-20T10:25:00+01:00", price:599 },
    { id:"DUBAI",     name:"Dubai (UAE)",           code:"SUN12",   discount:"12% off",  image:"image/dubai.jpeg",
      airline:"Emirates",          flightNo:"EK6",    from:"LHR", to:"DXB", departISO:"2025-08-28T21:10:00+01:00", price:529 },
    { id:"SINGAPORE", name:"Singapore",             code:"ASIA12",  discount:"12% off",  image:"image/singapore.jpeg",
      airline:"Singapore Airlines",flightNo:"SQ319",  from:"LHR", to:"SIN", departISO:"2025-08-29T22:05:00+01:00", price:829 },
    { id:"SANTORINI", name:"Santorini (Greece)",    code:"SANTO10", discount:"10% off",  image:"image/santorini.jpeg",
      airline:"British Airways",  flightNo:"BA652",  from:"LHR", to:"JTR", departISO:"2025-09-05T06:35:00+01:00", price:289 },
    { id:"KYOTO",     name:"Kyoto (via Tokyo)",     code:"MOMIJI12",discount:"12% off",  image:"image/kyato.jpeg",
      airline:"Japan Airlines",   flightNo:"JL44",   from:"LHR", to:"HND", departISO:"2025-09-10T19:00:00+01:00", price:899 },
    { id:"BALI",      name:"Bali (Indonesia)",      code:"BALI15",  discount:"15% off",  image:"image/bali.jpeg",
      airline:"Singapore Airlines",flightNo:"SQ319", from:"LHR", to:"SIN", departISO:"2025-08-29T22:05:00+01:00", price:869 },
    { id:"MALDIVES",  name:"Maldives",              code:"MALD20",  discount:"20% off",  image:"image/maldives.jpeg",
      airline:"Emirates",          flightNo:"EK6",   from:"LHR", to:"DXB", departISO:"2025-08-28T21:10:00+01:00", price:999 },
    { id:"ROME",      name:"Rome (Italy)",          code:"ROMA10",  discount:"10% off",  image:"image/rome.jpeg",
      airline:"British Airways",  flightNo:"BA548",  from:"LHR", to:"FCO", departISO:"2025-09-03T07:25:00+01:00", price:179 },
    { id:"SYDNEY",    name:"Sydney (Australia)",    code:"DOWN15",  discount:"15% off",  image:"image/sydney.jpeg",
      airline:"Qantas",            flightNo:"QF2",   from:"LHR", to:"SIN", departISO:"2025-09-12T21:15:00+01:00", price:1199 }
  ];

  /* ===== Auth & Tickets ===== */
  const Auth = { current(){ return sessionStorage.getItem("signedInEmail"); } };
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

  /* ===== Render vacation cards with Book buttons ===== */
  $("#vacationsList").html(VACATIONS.map(v=>`
    <article class="vacations-card">
      <img src="${v.image}" alt="${v.name}">
      <div class="card-body">
        <h3>${v.name}</h3>
        <p class="badge">${v.discount}</p>
        <p>From ${v.from} → ${v.to} · ${v.airline} <strong>${v.flightNo}</strong></p>
        <p>⏳ ${until(v.departISO)} · <strong>${fmtMoney(v.price)}</strong></p>
        <button class="btn book" data-id="${v.id}">Book Now</button>
      </div>
    </article>`).join(""));

  $(".book").on("click", function(){
    const id=$(this).data("id");
    const v=VACATIONS.find(x=>x.id===id);
    if(!Auth.current()){ location.href="auth.html"; return; }
    $("#drawerTitle").text(`${v.name} — ${v.airline} ${v.flightNo}`);
    $("#drawer").attr("open", true);

    $("#buyForm").off("submit").on("submit", function(e){
      e.preventDefault();
      const name = $("#fullName").val().trim();
      const cardNo = $("#cardNo").val().replace(/\D/g,"");
      const sort   = $("#sortCode").val().replace(/\D/g,"");
      if(!name || cardNo.length!==16 || sort.length!==6){
        toast("Enter full name, 16-digit card and 6-digit sort code");
        return;
      }
      const ticket={ type:"vacation", ref:`SV${Date.now()}`, name,
        airline:v.airline, flightNo:v.flightNo, from:v.from, to:v.to, departISO:v.departISO, destination:v.name };
      const list=getTickets(); list.push(ticket); saveTickets(list);

      $("#drawer").removeAttr("open");
      toast("Ticket purchased successfully!", true);
      setTimeout(()=> location.href="tickets.html", 1100);
    });
  });

  $(".drawer-close").on("click", ()=> $("#drawer").removeAttr("open"));
});
