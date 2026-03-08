const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const validateEnrollment = require('../middleware/validateEnrollment');

router.get('/', async (req, res) => {
    try {
        const { data: courses, error } = await supabase
            .from('courses')
            .select('*');

        if (error) {
            throw error;
        }
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ 
            error: 'Failed to fetch courses' 
        });
    }
});

router.post('/enroll', validateEnrollment, async (req, res) => {
    try {
        const { student_name, course_id } = req.body;
        const { data, error } = await supabase
            .from('enrollments')
            .insert([
                { 
                    student_name: student_name, 
                    course_id: course_id 
                }
            ])
            .select();

        if (error) {
            throw error;
        }
        res.status(201).json({ 
            message: 'Enrollment successful', 
            enrollment: data[0] 
        });
    } catch (error) {
        console.error('Error creating enrollment:', error);
        res.status(500).json({ 
            error: 'Failed to create enrollment' 
        });
    }
});

router.get('/:id/enrollments', async (req, res) => {
    try {
        const courseId = req.params.id;
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('title')
            .eq('id', courseId)
            .single();

        if (courseError || !course) {
            return res.status(404).json({ 
                error: 'Course not found' 
            });
        }
        const { data: enrollments, error: enrollmentsError } = await supabase
            .from('enrollments')
            .select('student_name, course_id')
            .eq('course_id', courseId);

        if (enrollmentsError) {
            throw enrollmentsError;
        }
        res.json(enrollments);
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({ 
            error: 'Failed to fetch enrollments' 
        });
    }
});

module.exports = router;