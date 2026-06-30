var FORMEASY_URL = 'https://script.google.com/macros/s/AKfycbxpoyrCmW8QeykaSghU8tMkBvmC5Txho-RclMuZH87933IYxbjpoRLcpV9Nx_e4UpY8/exec';

(function () {
  var state = { service: null, date: null, time: null, isGeneral: false };

  // ── Step helpers ──────────────────────────────────────────
  function showStep(id) {
    document.querySelectorAll('.booking-step').forEach(function (s) {
      s.classList.remove('active');
    });
    var el = document.getElementById(id);
    el.classList.add('active');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Static back buttons (step-service backs are always correct)
  ['step-date', 'step-date-simple'].forEach(function (id) {
    document.querySelector('#' + id + ' .step-back').addEventListener('click', function () {
      showStep('step-service');
    });
  });

  function updateSummary() {
    document.getElementById('sum-service').textContent = state.service;
    var hasDate = state.date;
    var hasTime = state.time;
    document.getElementById('sum-date').textContent = hasDate ? formatDate(state.date) : '';
    document.getElementById('sum-time').textContent = hasTime ? state.time : '';
    document.getElementById('sum-sep-date').style.display = hasDate ? '' : 'none';
    document.getElementById('sum-sep-time').style.display = hasTime ? '' : 'none';
  }

  // ── Step 1: service selection ─────────────────────────────
  var simpleDateInput = document.getElementById('f-date-simple');
  simpleDateInput.min = new Date().toISOString().split('T')[0];

  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('.service-card').forEach(function (c) {
        c.classList.remove('selected');
      });
      card.classList.add('selected');
      state.service = card.dataset.service;
      state.date = null;
      state.time = null;

      state.isGeneral = !!card.dataset.general;

      if (state.isGeneral) {
        // General inquiry — simple date step
        document.getElementById('ctx-service-simple').textContent = state.service;
        simpleDateInput.value = '';
        showStep('step-date-simple');
      } else {
        // Bookable service — calendar + slots
        document.getElementById('ctx-service').textContent = state.service;
        clearSlots();
        cal.selected = null;
        showStep('step-date');
        fetchAvailableDates();
      }
    });
  });

  document.querySelector('#step-form .step-back').addEventListener('click', function () {
    showStep(state.isGeneral ? 'step-date-simple' : 'step-date');
  });

  // General inquiry: continue button
  document.getElementById('btn-continue-general').addEventListener('click', function () {
    state.date = simpleDateInput.value || null;
    state.time = null;
    updateSummary();
    showStep('step-form');
  });

  // ── Calendar ──────────────────────────────────────────────
  var cal = {
    year: null,
    month: null,
    selected: null,
    availableDates: [],

    init: function () {
      var now = new Date();
      this.year = now.getFullYear();
      this.month = now.getMonth();
    },

    render: function () {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var available = new Set(this.availableDates);

      var monthName = new Date(this.year, this.month, 1)
        .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      document.getElementById('cal-month-label').textContent = monthName;

      var firstWeekday = new Date(this.year, this.month, 1).getDay();
      var daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

      var html = ['Su','Mo','Tu','We','Th','Fr','Sa'].map(function (d) {
        return '<div class="cal__day-label">' + d + '</div>';
      }).join('');

      for (var pad = 0; pad < firstWeekday; pad++) {
        html += '<div class="cal__day"></div>';
      }

      for (var d = 1; d <= daysInMonth; d++) {
        var dateStr = this.year + '-' + zeroPad(this.month + 1) + '-' + zeroPad(d);
        var dateObj = new Date(this.year, this.month, d);
        var isPast = dateObj < today;
        var isAvail = available.has(dateStr);
        var isSel = this.selected === dateStr;

        var cls = 'cal__day';
        if (isPast)   cls += ' cal__day--past';
        if (isAvail && !isPast) cls += ' cal__day--available';
        if (isSel)    cls += ' cal__day--selected';

        var dot = (isAvail && !isPast) ? '<span class="cal__dot"></span>' : '';
        html += '<div class="' + cls + '" data-date="' + dateStr + '">' + d + dot + '</div>';
      }

      var grid = document.getElementById('cal-grid');
      grid.innerHTML = html;

      var self = this;
      grid.querySelectorAll('.cal__day--available').forEach(function (el) {
        el.addEventListener('click', function () {
          self.selected = el.dataset.date;
          self.render();
          state.date = self.selected;
          state.time = null;
          clearSlots();
          fetchSlots(state.date);
        });
      });
    },
  };

  document.getElementById('cal-prev').addEventListener('click', function () {
    cal.month--;
    if (cal.month < 0) { cal.month = 11; cal.year--; }
    cal.render();
  });

  document.getElementById('cal-next').addEventListener('click', function () {
    cal.month++;
    if (cal.month > 11) { cal.month = 0; cal.year++; }
    cal.render();
  });

  function fetchAvailableDates() {
    document.getElementById('cal-loading').style.display = 'block';
    document.getElementById('cal-error').style.display = 'none';
    document.getElementById('cal-grid').innerHTML = '';

    jsonp(FORMEASY_URL, { service: state.service }, function (data) {
      document.getElementById('cal-loading').style.display = 'none';
      cal.availableDates = data.availableDates || [];
      cal.init();
      cal.render();
    }, function () {
      document.getElementById('cal-loading').style.display = 'none';
      document.getElementById('cal-error').style.display = 'block';
      // Still render calendar without dots
      cal.init();
      cal.render();
    });
  }

  // ── Slot fetching ─────────────────────────────────────────
  function clearSlots() {
    document.getElementById('slots-loading').style.display = 'none';
    document.getElementById('slots-none').style.display = 'none';
    document.getElementById('slots-error').style.display = 'none';
    document.getElementById('slots-grid').innerHTML = '';
  }

  function fetchSlots(date) {
    clearSlots();
    document.getElementById('slots-loading').style.display = 'block';

    jsonp(FORMEASY_URL, { date: date, service: state.service }, function (data) {
      document.getElementById('slots-loading').style.display = 'none';
      var slots = data.slots || [];
      if (slots.length === 0) {
        document.getElementById('slots-none').style.display = 'block';
        return;
      }
      var grid = document.getElementById('slots-grid');
      slots.forEach(function (time) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slot-btn';
        btn.textContent = time;
        btn.addEventListener('click', function () {
          document.querySelectorAll('.slot-btn').forEach(function (b) {
            b.classList.remove('selected');
          });
          btn.classList.add('selected');
          state.time = time;
          updateSummary();
          setTimeout(function () { showStep('step-form'); }, 180);
        });
        grid.appendChild(btn);
      });
    }, function () {
      document.getElementById('slots-loading').style.display = 'none';
      document.getElementById('slots-error').style.display = 'block';
    });
  }

  // ── Form submission ───────────────────────────────────────
  document.getElementById('booking-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = document.getElementById('booking-submit');
    var errorEl = document.getElementById('booking-error');
    errorEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var data = {
      service: state.service,
      date: state.date,
      time: state.time,
      name: document.getElementById('f-name').value.trim(),
      email: document.getElementById('f-email').value.trim(),
      phone: document.getElementById('f-phone').value.trim(),
      message: document.getElementById('f-message').value.trim(),
    };

    fetch(FORMEASY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
    })
      .then(function (res) { return res.json(); })
      .then(function () {
        document.getElementById('booking-form-wrap').style.display = 'none';
        document.getElementById('booking-success').classList.add('visible');
      })
      .catch(function () {
        errorEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Send Request';
      });
  });

  // ── JSONP helper ──────────────────────────────────────────
  function jsonp(url, params, onSuccess, onError) {
    var cbName = '_cb' + Date.now();
    var script = document.createElement('script');
    var done = false;

    window[cbName] = function (data) {
      done = true;
      cleanup();
      onSuccess(data);
    };

    script.onerror = function () { cleanup(); onError(); };

    setTimeout(function () {
      if (!done) { cleanup(); onError(); }
    }, 8000);

    function cleanup() {
      clearTimeout();
      delete window[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    var query = '?callback=' + cbName;
    Object.keys(params).forEach(function (k) {
      query += '&' + k + '=' + encodeURIComponent(params[k]);
    });
    script.src = url + query;
    document.body.appendChild(script);
  }

  // ── Helpers ───────────────────────────────────────────────
  function zeroPad(n) { return n < 10 ? '0' + n : '' + n; }

  function formatDate(str) {
    var d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });
  }
})();
