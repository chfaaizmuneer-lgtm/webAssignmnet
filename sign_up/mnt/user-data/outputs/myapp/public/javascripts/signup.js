/**
 * signup.js
 * Client-side enhancements for the signup form:
 *  - Password strength meter
 *  - Password visibility toggles
 *  - Bootstrap HTML5 validation
 *  - Confirm-password cross-validation
 */

(function () {
  'use strict';

  // ── Password strength meter ──────────────────────────────────────────────
  const passwordInput = document.getElementById('password');
  const strengthBar   = document.getElementById('strengthBar');
  const strengthLabel = document.getElementById('strengthLabel');

  if (passwordInput && strengthBar && strengthLabel) {
    passwordInput.addEventListener('input', function () {
      const val   = this.value;
      const score = getStrengthScore(val);

      const levels = [
        { width: '0%',   color: 'transparent', label: '' },
        { width: '25%',  color: '#ef4444',      label: 'Weak' },
        { width: '50%',  color: '#f97316',      label: 'Fair' },
        { width: '75%',  color: '#eab308',      label: 'Good' },
        { width: '100%', color: '#22c55e',      label: 'Strong' },
      ];

      const level = levels[score];
      strengthBar.style.width    = level.width;
      strengthBar.style.background = level.color;
      strengthLabel.textContent  = level.label;
      strengthLabel.style.color  = level.color;
    });
  }

  function getStrengthScore(password) {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8)  score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }

  // ── Password visibility toggles ──────────────────────────────────────────
  document.querySelectorAll('.toggle-pw').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const input    = document.getElementById(targetId);
      const icon     = this.querySelector('i');

      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
      }
    });
  });

  // ── Bootstrap validation + confirm-password check ────────────────────────
  const form = document.getElementById('signupForm');

  if (form) {
    form.addEventListener('submit', function (event) {
      // Cross-validate passwords before Bootstrap kicks in
      const pw      = document.getElementById('password');
      const confirm = document.getElementById('confirmPassword');

      if (pw && confirm) {
        if (pw.value !== confirm.value) {
          confirm.setCustomValidity('Passwords do not match.');
        } else {
          confirm.setCustomValidity('');
        }
      }

      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    });

    // Clear confirm-password custom error as user types
    const confirmPw = document.getElementById('confirmPassword');
    if (confirmPw) {
      confirmPw.addEventListener('input', function () {
        this.setCustomValidity('');
      });
    }
  }
})();
