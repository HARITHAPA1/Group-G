$(function(){
  const getTickets = ()=> JSON.parse(localStorage.getItem("tickets")||"[]");
  const successIcon = () => `
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#00d1b2" stroke-width="2"/>
      <path d="M7 12.5l3.2 3.2L17 9" stroke="#00d1b2" stroke-width="2"/>
    </svg>`;

  const tickets=getTickets();
  if(tickets.length===0){ $("#ticketsList").html("<p>No tickets purchased yet.</p>"); return; }

  $("#ticketsList").html(tickets.map(t=>`
    <div class="ticket">
      <h3>${t.airline} <span class="badge">${t.flightNo}</span></h3>
      <p class="meta">${t.from} → ${t.to}</p>
      ${t.destination ? `<p class="meta">Destination: ${t.destination}</p>` : ""}
      <p class="meta">Passenger: ${t.name}</p>
      <p class="meta">Departure: ${new Date(t.departISO).toLocaleString()}</p>
      <div class="ok">${successIcon()} Ticket confirmed</div>
    </div>`).join(""));
});
