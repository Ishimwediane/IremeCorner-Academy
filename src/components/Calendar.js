import React, { useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';

const Calendar = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);

  // Create array with empty cells for days before month starts
  const daysArray = Array(firstDayOfWeek).fill(null).concat(daysInMonth);

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthName = format(currentDate, 'MMM yyyy');

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: '12px',
        p: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        height: '100%',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 700, color: '#202F32', fontSize: '0.95rem' }}>
          Schedule
        </Typography>
      </Box>

      {/* Month Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <IconButton onClick={handlePrevMonth} size="small" sx={{ color: '#202F32', p: 0.5 }}>
          <ChevronLeft fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32', fontSize: '0.85rem' }}>
          {monthName}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small" sx={{ color: '#202F32', p: 0.5 }}>
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>

      {/* Week Days Header */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 0.5 }}>
        {weekDays.map((day, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              textAlign: 'center',
              fontWeight: 600,
              color: 'rgba(32,47,50,0.5)',
              fontSize: '0.65rem',
              py: 0.25,
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar Grid - Compact */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {daysArray.map((date, index) => {
          if (!date) {
            return <Box key={`empty-${index}`} sx={{ aspectRatio: '1', p: 0.25 }} />;
          }

          const dayEvents = getEventsForDate(date);
          const isToday = isSameDay(date, new Date());
          const isCurrentMonth = isSameMonth(date, currentDate);

          return (
            <Tooltip
              key={date.toISOString()}
              title={dayEvents.map(e => e.title).join(', ') || ''}
              arrow
            >
              <Box
                sx={{
                  aspectRatio: '1',
                  p: 0.25,
                  borderRadius: '6px',
                  bgcolor: dayEvents.length > 0
                    ? (isToday ? 'rgba(195,151,102,0.2)' : 'rgba(195,151,102,0.1)')
                    : isToday
                      ? 'rgba(195,151,102,0.15)'
                      : 'transparent',
                  border: isToday ? '1.5px solid #C39766' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(195,151,102,0.15)',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: isToday ? 700 : 500,
                    color: isCurrentMonth ? '#202F32' : 'rgba(32,47,50,0.3)',
                    fontSize: '0.7rem',
                    lineHeight: 1,
                  }}
                >
                  {format(date, 'd')}
                </Typography>
                {dayEvents.length > 0 && (
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#C39766', mt: 0.25 }} />
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default Calendar;
