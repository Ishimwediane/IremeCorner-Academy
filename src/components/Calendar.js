import React, { useState } from 'react';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import { ChevronLeft, ChevronRight, MoreVert, Edit } from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';

const Calendar = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);
  
  // Create array with empty cells for days before month starts
  const daysArray = Array(firstDayOfWeek).fill(null).concat(daysInMonth);
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = format(currentDate, 'MMMM yyyy');

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
        borderRadius: '16px',
        p: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        height: '100%',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>
          Tasks Schedule
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" sx={{ color: '#202F32' }}>
            <MoreVert fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: '#202F32' }}>
            <Edit fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Month Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handlePrevMonth} size="small" sx={{ color: '#202F32' }}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#202F32' }}>
          {monthName}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small" sx={{ color: '#202F32' }}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Week Days Header */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
        {weekDays.map((day) => (
          <Typography
            key={day}
            variant="caption"
            sx={{
              textAlign: 'center',
              fontWeight: 600,
              color: 'rgba(32,47,50,0.6)',
              fontSize: '0.75rem',
              py: 0.5,
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {daysArray.map((date, index) => {
          if (!date) {
            return <Box key={`empty-${index}`} sx={{ aspectRatio: '1', p: 0.5 }} />;
          }

          const dayEvents = getEventsForDate(date);
          const isToday = isSameDay(date, new Date());
          const isCurrentMonth = isSameMonth(date, currentDate);

          return (
            <Box
              key={date.toISOString()}
              sx={{
                aspectRatio: '1',
                p: 0.5,
                borderRadius: '8px',
                bgcolor: dayEvents.length > 0 
                  ? (isToday ? 'rgba(195,151,102,0.15)' : 'rgba(195,151,102,0.08)')
                  : isToday 
                    ? 'rgba(195,151,102,0.1)' 
                    : 'transparent',
                border: isToday ? '2px solid #C39766' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(195,151,102,0.1)',
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isToday ? 700 : 500,
                  color: isCurrentMonth ? '#202F32' : 'rgba(32,47,50,0.4)',
                  fontSize: '0.85rem',
                  mb: 0.5,
                }}
              >
                {format(date, 'd')}
              </Typography>
              {dayEvents.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.25, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {dayEvents.slice(0, 2).map((event, idx) => (
                    <Avatar
                      key={idx}
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: event.color || '#C39766',
                        fontSize: '0.6rem',
                      }}
                    >
                      {event.initials || '?'}
                    </Avatar>
                  ))}
                  {dayEvents.length > 2 && (
                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#202F32' }}>
                      +{dayEvents.length - 2}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Calendar;






