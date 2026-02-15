import { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import api from '../../utils/api';
import {
  CATEGORIES,
  LEVELS,
  LANGUAGES,
  PRICES,
  DURATIONS,
  RATINGS,
  FORMATS,
  CERTIFICATIONS,
} from './constants';

// Helper functions can be defined outside the hook as they are pure
const getDurationCategory = (course) => {
  const totalHours = course.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0;
  if (totalHours < 2) return 'Short (< 2 hours)';
  if (totalHours <= 10) return 'Medium (2-10 hours)';
  return 'Long (> 10 hours)';
};

const getRatingCategory = (course) => {
  const avgRating = course.rating || 0;
  if (avgRating >= 5) return '5 Stars';
  if (avgRating >= 4) return '4+ Stars';
  return null;
};

const getPriceCategory = (course) => {
  const price = course.price || 0;
  return price === 0 ? 'Free' : 'Paid';
};

export const useCourseFilters = () => {
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    levels: [],
    languages: [],
    prices: [],
    durations: [],
    ratings: [],
    formats: [],
    certifications: [],
  });

  const { data: coursesData, isLoading } = useQuery(
    ['courses', filters.search], // Refetch only when search term changes
    async () => {
      const params = new URLSearchParams();
      params.append('status', 'approved');
      if (filters.search) params.append('search', filters.search);
      const response = await api.get(`/courses?${params.toString()}`);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  const allCourses = useMemo(() => coursesData?.data || [], [coursesData]);
  const totalCourses = coursesData?.count || allCourses.length;

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(course.category);
      const matchesLevel = filters.levels.length === 0 || filters.levels.includes(course.level);
      const matchesLanguage = filters.languages.length === 0 || (course.language && filters.languages.includes(course.language));
      const matchesPrice = filters.prices.length === 0 || filters.prices.includes(getPriceCategory(course));
      const matchesDuration = filters.durations.length === 0 || filters.durations.includes(getDurationCategory(course));
      const courseRating = getRatingCategory(course);
      const matchesRating = filters.ratings.length === 0 || (courseRating && filters.ratings.includes(courseRating));
      const matchesFormat = filters.formats.length === 0 || (course.format && filters.formats.includes(course.format));
      const matchesCertification = filters.certifications.length === 0 ||
        (filters.certifications.includes('With Certificate') && course.certificate) ||
        (filters.certifications.includes('No Certificate') && !course.certificate);

      return matchesCategory && matchesLevel && matchesLanguage && matchesPrice &&
        matchesDuration && matchesRating && matchesFormat && matchesCertification;
    });
  }, [allCourses, filters]);

  const counts = useMemo(() => {
    const calculateCounts = (items, getCategory) =>
      items.reduce((acc, item) => {
        acc[item] = allCourses.filter((c) => getCategory(c) === item).length;
        return acc;
      }, {});

    return {
      categories: calculateCounts(CATEGORIES, (c) => c.category),
      levels: calculateCounts(LEVELS, (c) => c.level),
      languages: calculateCounts(LANGUAGES, (c) => c.language),
      prices: calculateCounts(PRICES, getPriceCategory),
      durations: calculateCounts(DURATIONS, getDurationCategory),
      ratings: calculateCounts(RATINGS, getRatingCategory),
      formats: calculateCounts(FORMATS, (c) => c.format),
      certifications: CERTIFICATIONS.reduce((acc, cert) => {
        acc[cert] = allCourses.filter((c) => (cert === 'With Certificate' ? c.certificate : !c.certificate)).length;
        return acc;
      }, {}),
    };
  }, [allCourses]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  return {
    isLoading,
    courses: filteredCourses,
    totalCourses,
    filters,
    setFilters,
    handleFilterChange,
    counts,
  };
};