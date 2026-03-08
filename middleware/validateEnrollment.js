const supabase = require('../supabaseClient');

const validateEnrollment = async (req, res, next) => {
    const { student_name, course_id } = req.body;
    if (!student_name) {
        return res.status(400).json({ 
            error: 'Student name is required' 
        });
    }
    if (!course_id) {
        return res.status(400).json({ 
            error: 'Course ID is required' 
        });
    }
    if (isNaN(course_id)) {
        return res.status(400).json({ 
            error: 'Course ID must be a number' 
        });
    }

    try {
        const { data: course, error } = await supabase
            .from('courses')
            .select('id')
            .eq('id', course_id)
            .single();

        if (error || !course) {
            return res.status(400).json({ 
                error: 'Course does not exist' 
            });
        }
        next();
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ 
            error: 'Server error during validation' 
        });
    }
};

module.exports = validateEnrollment;