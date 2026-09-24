/* Northward Care — form submission.
   Both forms post JSON to a Power Automate HTTP trigger. With no endpoint
   configured they validate and show the success state but send nothing, so
   the preview never pretends to have stored something. */
(function () {
  var CFG = window.NORTHWARD || {};
  var loadedAt = Date.now();

  function fieldsOf(scope) {
    return [].slice.call(scope.querySelectorAll('input,select,textarea'))
             .filter(function (el) { return el.name && el.type !== 'hidden'; });
  }

  function showError(el, message) {
    el.setAttribute('aria-invalid', 'true');
    var f = el.closest('.field') || el.closest('.consent');
    if (!f) return;
    var msg = f.querySelector('.err');
    if (!msg) {
      msg = document.createElement('span');
      msg.className = 'err';
      msg.setAttribute('role', 'alert');
      f.appendChild(msg);
    }
    msg.textContent = message;
  }

  function clearError(el) {
    el.removeAttribute('aria-invalid');
    var f = el.closest('.field') || el.closest('.consent');
    var msg = f && f.querySelector('.err');
    if (msg) msg.remove();
  }

  /* Validates a scope. Returns the first invalid control, or null. */
  function validate(scope) {
    var first = null;
    fieldsOf(scope).forEach(function (el) {
      clearError(el);
      if (!el.required) return;
      var bad = (el.type === 'checkbox') ? !el.checked : !String(el.value).trim();
      if (!bad && el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(el.value)) bad = true;
      if (bad) {
        showError(el, el.type === 'checkbox' ? 'Please tick this to continue.'
                    : el.type === 'email'    ? 'Please enter a valid email address.'
                                             : 'Please fill this in.');
        if (!first) first = el;
      }
    });
    return first;
  }

  function focusFirst(el) {
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function payload(form, source) {
    var data = { source: source, page: location.pathname, submittedAt: new Date().toISOString() };
    var consentLabel = form.querySelector('.consent label span');
    if (consentLabel) data.consentWording = consentLabel.textContent.replace(/\s+/g, ' ').trim();
    try {
      var p = new URLSearchParams(location.search);
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function (k) {
        if (p.get(k)) data[k] = p.get(k);
      });
      if (document.referrer) data.referrer = document.referrer;
    } catch (err) {}
    fieldsOf(form).forEach(function (el) {
      if (el.type === 'file') return;                       // uploaded separately
      data[el.name] = (el.type === 'checkbox') ? el.checked : el.value;
    });
    delete data.website;                                     // the honeypot
    return data;
  }

  function send(url, data) {
    if (!url) return Promise.resolve({ preview: true });
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) throw new Error(j.error || ('HTTP ' + r.status));
        return { preview: false };
      });
    });
  }

  function wire(form, opts) {
    if (!form) return;
    form.setAttribute('novalidate', '');

    // Honeypot: a real person never fills a field they cannot see.
    var pot = document.createElement('input');
    pot.type = 'text'; pot.name = 'website'; pot.tabIndex = -1;
    pot.autocomplete = 'off'; pot.setAttribute('aria-hidden', 'true');
    pot.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
    form.appendChild(pot);

    form.addEventListener('input', function (e) {
      if (e.target.matches('[aria-invalid]')) clearError(e.target);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var scope = opts.scope ? opts.scope() : form;
      var bad = validate(scope);
      if (bad) return focusFirst(bad);

      if (pot.value || (Date.now() - loadedAt) < (CFG.minSeconds || 3) * 1000) {
        return opts.done(form, { preview: true, silent: true });
      }

      var btn = form.querySelector('button[type=submit]');
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      send(opts.endpoint(), payload(form, opts.source))
        .then(function (res) { opts.done(form, res); })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
          var box = document.createElement('p');
          box.className = 'formerror';
          box.setAttribute('role', 'alert');
          box.innerHTML = 'Something went wrong sending that. Please try again, or email ' +
                          '<a href="mailto:hello@northwardcare.com">hello@northwardcare.com</a>.';
          var old = form.querySelector('.formerror');
          if (old) old.remove();
          form.appendChild(box);
          box.scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
    });
  }

  function panel(form, title, body) {
    var d = document.createElement('div');
    d.className = 'formdone';
    d.setAttribute('role', 'status');
    d.innerHTML = '<h3>' + title + '</h3>' + body;
    form.replaceWith(d);
    d.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  /* ---- the guide: submit, then the download starts itself -------------- */
  wire(document.getElementById('guide-form'), {
    source: 'guide',
    endpoint: function () { return CFG.endpoint; },
    done: function (form, res) {
      var file = CFG.guideFile;
      if (file && !res.silent) {
        var a = document.createElement('a');
        a.href = file; a.download = '';
        document.body.appendChild(a); a.click(); a.remove();
      }
      panel(form, 'Your guide is downloading.',
        '<p>If it hasn&rsquo;t started, <a href="' + file + '" download>download it here</a>.</p>' +
        '<p>Reading the guide will tell you how the journey works. It won&rsquo;t tell you when a role that suits you comes up &mdash; that&rsquo;s what the Register is for.</p>' +
        '<p><a class="btn btn-primary" href="register.html">Join the Register</a></p>' +
        (res.preview ? '<p class="previewline">Preview mode: no endpoint configured, so nothing was sent or stored.</p>' : ''));
    }
  });

  /* ---- the Register ---------------------------------------------------- */
  var reg = document.getElementById('register-form');
  wire(reg, {
    source: 'register',
    scope: function () { return reg.querySelector('.step-panel:not([hidden])'); },
    endpoint: function () { return CFG.endpoint; },
    done: function (form, res) {
      panel(form, 'You&rsquo;re on the Register.',
        '<p>We&rsquo;ll email you to confirm. If something on your profile needs clarifying we&rsquo;ll ask once, and then you&rsquo;ll hear from us when a live UK role suits you.</p>' +
        '<p>In the meantime, the free guide covers the whole journey.</p>' +
        '<p><a class="btn btn-primary" href="guide.html">Get the free guide</a></p>' +
        (res.preview ? '<p class="previewline">Preview mode: no endpoint configured, so nothing was sent or stored.</p>' : ''));
    }
  });

  // Steps validate before they advance, so nobody reaches step 3 and then
  // gets sent back to step 1 to fix a missing field.
  if (reg) {
    reg.addEventListener('click', function (e) {
      var b = e.target.closest('[data-next]');
      if (!b) return;
      var bad = validate(reg.querySelector('.step-panel:not([hidden])'));
      if (bad) { e.stopImmediatePropagation(); focusFirst(bad); }
    }, true);
  }
})();
