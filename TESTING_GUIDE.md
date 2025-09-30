# 🧪 ClassroomAI Testing Guide

## Quick Test Commands

### Run Development Server
```bash
npm run dev
# Visit: http://localhost:3000
```

### Build for Production
```bash
npm run build
npm run start
# Visit: http://localhost:3000
```

### Run Linting
```bash
npm run lint
```

---

## 📱 RESPONSIVE TESTING CHECKLIST

### ✅ Mobile Devices (< 640px)

#### iPhone SE (375px × 667px)
- [ ] Landing page navbar fully visible
- [ ] Logo displays correctly
- [ ] CTA buttons are clickable and properly sized
- [ ] All text is readable
- [ ] Sidebar collapses automatically
- [ ] Touch targets are at least 44px
- [ ] No horizontal scrolling
- [ ] Images scale properly
- [ ] Forms are usable
- [ ] Modals fit screen

#### iPhone 12/13/14 (390px × 844px)
- [ ] Same as above
- [ ] Safe area respected (notch)
- [ ] Bottom navigation accessible

#### iPhone 14 Pro Max (430px × 932px)
- [ ] Larger screen utilization
- [ ] Dynamic Island area clear
- [ ] All features accessible

### ✅ Tablets (640px - 1024px)

#### iPad Mini (768px × 1024px)
- [ ] 2-column grid layouts work
- [ ] Sidebar shows/hides properly
- [ ] Charts render correctly
- [ ] Touch gestures work
- [ ] Landscape mode works
- [ ] Portrait mode works

#### iPad Pro (1024px × 1366px)
- [ ] 3-column layouts appear
- [ ] Full dashboard features visible
- [ ] Apple Pencil interactions (if applicable)

### ✅ Desktop (> 1024px)

#### Standard Desktop (1280px × 720px)
- [ ] 4-column grid layouts
- [ ] Sidebar expanded by default
- [ ] All hover states work
- [ ] Mouse interactions smooth
- [ ] Keyboard navigation works

#### Large Desktop (1920px × 1080px)
- [ ] Maximum width containers
- [ ] Proper spacing utilization
- [ ] No excessive whitespace
- [ ] Charts scale appropriately

#### Ultra-wide (2560px × 1440px)
- [ ] Content centered properly
- [ ] Max-width containers work
- [ ] Readability maintained

---

## 🌐 BROWSER TESTING

### Chrome (Latest)
- [ ] All features work
- [ ] DevTools shows no errors
- [ ] Network requests successful
- [ ] Local storage works
- [ ] Smooth scrolling works

### Firefox (Latest)
- [ ] SVG logos render correctly
- [ ] Animations smooth
- [ ] Forms submit properly
- [ ] No console errors

### Safari (Latest)
- [ ] iOS compatibility
- [ ] Webkit-specific features work
- [ ] Backdrop blur works
- [ ] Date pickers work

### Edge (Latest)
- [ ] Chromium compatibility
- [ ] No rendering issues
- [ ] All features functional

---

## 🎨 LANDING PAGE TESTS

### Navbar
```
Test Steps:
1. Load homepage
2. Check if navbar is fully visible
3. Click logo - should stay on page or go to top
4. Click "Features" link - should scroll to features
5. Click "Sign In" - should go to /login
6. Click "Get Started" - should go to /signup
7. Resize browser to mobile - check menu button appears
8. Test on mobile device - ensure no cutoff
```

**Expected Results:**
- ✅ Navbar fully visible on all screen sizes
- ✅ Logo SVG renders perfectly
- ✅ All links work
- ✅ Smooth scroll to sections
- ✅ Mobile menu toggles

### Hero Section
```
Test Steps:
1. Check hero content is centered
2. Verify gradient background
3. Test CTA buttons
4. Check responsive text sizing
5. Test animations (if any)
```

**Expected Results:**
- ✅ Content centered and readable
- ✅ Gradient displays correctly
- ✅ Buttons functional
- ✅ Text scales on mobile

### Theme Switching
```
Test Steps:
1. Toggle light/dark mode
2. Check all sections adapt
3. Verify contrast ratios
4. Test LaserFlow (dark mode only)
```

**Expected Results:**
- ✅ Instant theme switching
- ✅ All colors adapt properly
- ✅ Readable in both modes
- ✅ LaserFlow only in dark mode

---

## 👨‍🏫 TEACHER DASHBOARD TESTS

### Login & Authentication
```
Test Steps:
1. Go to /login
2. Enter teacher credentials
3. Click login
4. Should redirect to /dashboard
```

**Expected Results:**
- ✅ Successful login
- ✅ Session persists
- ✅ Redirect works

### Sidebar Navigation
```
Test Steps:
1. Check logo displays (SVG)
2. Click expand/collapse button
3. Test all menu items
4. Check active states
5. Test on mobile (auto-collapse)
```

**Expected Results:**
- ✅ Logo SVG renders
- ✅ Sidebar animates smoothly
- ✅ All links work
- ✅ Active state shows correctly
- ✅ Mobile behavior correct

### PIN Attendance
```
Test Steps:
1. Click "Create PIN Session"
2. Fill in details
3. Generate PIN
4. Check countdown timer
5. Test PIN verification
6. Close session
```

**Expected Results:**
- ✅ Modal opens
- ✅ Form validates
- ✅ PIN generated
- ✅ Timer counts down
- ✅ Students can mark
- ✅ Session closes properly

### Charts & Analytics
```
Test Steps:
1. Check attendance chart loads
2. Verify grade distribution
3. Test subject performance chart
4. Check data updates
```

**Expected Results:**
- ✅ All charts render
- ✅ Data displays correctly
- ✅ Responsive on mobile
- ✅ Theme-aware colors

### Responsive Behavior
```
Test Steps:
1. Resize to mobile (< 640px)
2. Check grid becomes single column
3. Verify stats cards stack
4. Test chart responsiveness
5. Check tabs work on mobile
```

**Expected Results:**
- ✅ 1-column layout
- ✅ Cards stack nicely
- ✅ Charts scale
- ✅ Tabs scrollable/stacked

---

## 👨‍🎓 STUDENT DASHBOARD TESTS

### Student Login
```
Test Steps:
1. Login as student
2. Redirect to /student/dashboard
3. Check dashboard loads
```

**Expected Results:**
- ✅ Login successful
- ✅ Correct redirect
- ✅ Data loads

### Mark Attendance via PIN
```
Test Steps:
1. Click "Mark Attendance"
2. Enter PIN code
3. Submit
4. Check confirmation
```

**Expected Results:**
- ✅ Modal opens
- ✅ PIN input works
- ✅ Validation works
- ✅ Success message shows
- ✅ Attendance recorded

### View Assignments
```
Test Steps:
1. Navigate to Assignments
2. Check list displays
3. Click on assignment
4. Test submission (if applicable)
```

**Expected Results:**
- ✅ Assignments load
- ✅ Details viewable
- ✅ Submission works

### Student Analytics
```
Test Steps:
1. Check progress chart
2. Verify subject performance
3. Test attendance percentage
```

**Expected Results:**
- ✅ Charts display
- ✅ Correct data shown
- ✅ Responsive

---

## 👔 DEAN DASHBOARD TESTS

### Dean Login & Overview
```
Test Steps:
1. Login as dean
2. Check /dean/dashboard loads
3. Verify analytics
```

**Expected Results:**
- ✅ Login works
- ✅ Dashboard loads
- ✅ All sections visible

### Analytics View
```
Test Steps:
1. Check faculty performance
2. Verify department stats
3. Test enrollment trends
```

**Expected Results:**
- ✅ Charts render
- ✅ Data accurate
- ✅ Filters work (if any)

---

## 🌍 INTERNATIONALIZATION TESTS

### Language Switching
```
Test Steps:
1. Click language switcher
2. Search for "Hindi"
3. Select Hindi
4. Check UI updates
5. Test all dashboards
6. Switch back to English
```

**Expected Results:**
- ✅ Search works
- ✅ Language changes instantly
- ✅ All text translates
- ✅ No hydration errors
- ✅ Persistent across pages

### Test Multiple Languages
```
Languages to Test:
- English (default)
- Hindi (हिंदी)
- Bengali (বাংলা)
- Tamil (தமிழ்)
- Spanish (Español)
- Urdu (اردو) - RTL test
```

**For each language:**
- [ ] Dashboard labels translate
- [ ] Sidebar translates
- [ ] Forms translate
- [ ] Error messages translate
- [ ] Date formats adapt
- [ ] Number formats adapt (if applicable)

---

## 🎨 THEME TESTING

### Light Mode
```
Test Steps:
1. Enable light mode
2. Check all pages
3. Verify contrast
4. Test all components
```

**Expected Results:**
- ✅ White/gray backgrounds
- ✅ Dark text readable
- ✅ Borders visible
- ✅ Charts adapt
- ✅ No WCAG violations

### Dark Mode
```
Test Steps:
1. Enable dark mode
2. Check all pages
3. Verify contrast
4. Test LaserFlow effect
```

**Expected Results:**
- ✅ Black/dark backgrounds
- ✅ White text readable
- ✅ Borders visible
- ✅ LaserFlow shows
- ✅ No WCAG violations

---

## ⚡ PERFORMANCE TESTS

### Lighthouse Audit
```bash
# In Chrome DevTools
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Desktop" or "Mobile"
4. Check all categories
5. Click "Generate Report"
```

**Target Scores:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Page Load Speed
```
Test on:
- Fast 4G
- Slow 3G
- Offline (if PWA)
```

**Expected Results:**
- ✅ First paint < 1.5s
- ✅ Interactive < 3.5s
- ✅ No layout shifts

### Bundle Size
```bash
npm run build
# Check .next/static/chunks
```

**Expected:**
- Main bundle < 200KB
- Total JS < 500KB

---

## ♿ ACCESSIBILITY TESTS

### Keyboard Navigation
```
Test Steps:
1. Tab through all interactive elements
2. Check focus visible
3. Test escape key on modals
4. Try arrow keys in menus
```

**Expected Results:**
- ✅ All elements focusable
- ✅ Focus ring visible
- ✅ Logical tab order
- ✅ Escape closes modals

### Screen Reader
```
Tools: NVDA (Windows), VoiceOver (Mac)

Test:
1. Navigate with screen reader
2. Check labels announced
3. Test form inputs
4. Verify buttons described
```

**Expected Results:**
- ✅ All content readable
- ✅ Proper ARIA labels
- ✅ Forms accessible
- ✅ Navigation clear

### Color Contrast
```
Tool: Chrome DevTools Color Picker

Test:
1. Check text on backgrounds
2. Verify button contrast
3. Test disabled states
```

**Expected:**
- ✅ 4.5:1 for normal text
- ✅ 3:1 for large text
- ✅ No contrast failures

---

## 🔒 SECURITY TESTS

### Authentication
- [ ] Can't access dashboard without login
- [ ] Session expires correctly
- [ ] Logout clears session
- [ ] No sensitive data in localStorage
- [ ] HTTPS enforced in production

### API Security
- [ ] CORS configured properly
- [ ] Rate limiting in place
- [ ] SQL injection prevented
- [ ] XSS prevention working
- [ ] CSRF tokens used

---

## 📊 CROSS-BROWSER MATRIX

| Feature | Chrome | Firefox | Safari | Edge | Mobile Safari | Chrome Mobile |
|---------|--------|---------|--------|------|---------------|---------------|
| SVG Logo | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Navbar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sidebar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Charts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Animations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Theme | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| i18n | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Navbar cut off
**Solution:** ✅ FIXED - Updated positioning to use `left-0 right-0`

### Issue: Logo not showing
**Solution:** Check SVG gradients have unique IDs per dashboard

### Issue: Sidebar doesn't collapse
**Solution:** Verify SidebarProvider wraps layout

### Issue: Theme doesn't switch
**Solution:** Check theme-provider in root layout

### Issue: Translations not working
**Solution:** Verify useTranslations hook and translation keys exist

---

## ✅ FINAL PRE-LAUNCH CHECKLIST

### Code Quality
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Linting passes
- [ ] Build succeeds
- [ ] All tests pass

### User Experience
- [ ] All features work as expected
- [ ] Forms validate properly
- [ ] Error messages helpful
- [ ] Loading states present
- [ ] Success messages show

### Performance
- [ ] Lighthouse score > 90
- [ ] Page load < 3s
- [ ] No memory leaks
- [ ] Images optimized
- [ ] Bundle size acceptable

### Security
- [ ] Authentication working
- [ ] Authorization correct
- [ ] Data validation in place
- [ ] API secured
- [ ] Sensitive data protected

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] ARIA labels present

### Responsiveness
- [ ] Mobile (< 640px) ✓
- [ ] Tablet (640-1024px) ✓
- [ ] Desktop (> 1024px) ✓
- [ ] All orientations ✓
- [ ] All breakpoints ✓

---

## 🎉 YOU'RE READY FOR PRODUCTION!

If all tests pass, your ClassroomAI application is **production-ready**!

**Next Steps:**
1. ✅ Review PRODUCTION_CHECKLIST.md
2. ✅ Set up monitoring
3. ✅ Deploy to staging
4. ✅ Final user acceptance testing
5. ✅ Deploy to production
6. 🎉 Launch!

---

**Happy Testing! 🚀**
