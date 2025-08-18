$(function(){
  const Auth = {
    _users(){ return JSON.parse(localStorage.getItem("users")||"{}"); },
    _save(u){ localStorage.setItem("users", JSON.stringify(u)); },
    signUp(e,p){ const u=this._users(); if(u[e]) return false; u[e]=p; this._save(u); sessionStorage.setItem("signedInEmail",e); return true; },
    login(e,p){ const u=this._users(); if(u[e]&&u[e]===p){ sessionStorage.setItem("signedInEmail",e); return true; } return false; }
  };
  const toast = m => { const el=$("#toast"); el.text(m).addClass("show"); setTimeout(()=>el.removeClass("show"),2000); };

  $("#tabLogin").on("click", ()=>{ $("#tabLogin").addClass("active"); $("#tabSignup").removeClass("active"); $("#loginFormWrapper").show(); $("#signupFormWrapper").hide(); });
  $("#tabSignup").on("click", ()=>{ $("#tabSignup").addClass("active"); $("#tabLogin").removeClass("active"); $("#signupFormWrapper").show(); $("#loginFormWrapper").hide(); });

  $("#loginForm").on("submit", e=>{
    e.preventDefault();
    const ok = Auth.login($("#loginEmail").val().trim(), $("#loginPassword").val().trim());
    if(ok){ toast("Login successful"); setTimeout(()=> location.href="flights.html", 900); }
    else toast("Invalid email or password");
  });

  $("#signupForm").on("submit", e=>{
    e.preventDefault();
    const ok = Auth.signUp($("#signupEmail").val().trim(), $("#signupPassword").val().trim());
    if(ok){ toast("Account created"); setTimeout(()=> location.href="flights.html", 900); }
    else toast("Email already exists");
  });
});
