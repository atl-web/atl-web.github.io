import arrowRight from '@phosphor-icons/core/assets/regular/arrow-right.svg?raw';
import bookOpen from '@phosphor-icons/core/assets/regular/book-open.svg?raw';
import calendarDots from '@phosphor-icons/core/assets/regular/calendar-dots.svg?raw';
import calendar from '@phosphor-icons/core/assets/regular/calendar.svg?raw';
import caretLeft from '@phosphor-icons/core/assets/regular/caret-left.svg?raw';
import caretRight from '@phosphor-icons/core/assets/regular/caret-right.svg?raw';
import clock from '@phosphor-icons/core/assets/regular/clock.svg?raw';
import fileText from '@phosphor-icons/core/assets/regular/file-text.svg?raw';
import instagramLogo from '@phosphor-icons/core/assets/regular/instagram-logo.svg?raw';
import mapPin from '@phosphor-icons/core/assets/regular/map-pin.svg?raw';
import medal from '@phosphor-icons/core/assets/regular/medal.svg?raw';
import student from '@phosphor-icons/core/assets/regular/student.svg?raw';
import target from '@phosphor-icons/core/assets/regular/target.svg?raw';
import trophy from '@phosphor-icons/core/assets/regular/trophy.svg?raw';
import users from '@phosphor-icons/core/assets/regular/users.svg?raw';

export const icons = {
  'arrow-right': arrowRight,
  'book-open': bookOpen,
  calendar,
  'calendar-dots': calendarDots,
  'caret-left': caretLeft,
  'caret-right': caretRight,
  clock,
  'file-text': fileText,
  'instagram-logo': instagramLogo,
  'map-pin': mapPin,
  medal,
  student,
  target,
  trophy,
  users,
} as const;

export type IconName = keyof typeof icons;
