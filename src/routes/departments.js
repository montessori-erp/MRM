// import { Router } from 'express';
// import { list, getOne, create, update } from '../controllers/departmentController.js';
// import { protect, superAdminOnly } from '../middleware/auth.js';

// const router = Router();

// router.get('/', list);
// router.get('/:id', protect, getOne);
// router.post('/', protect, superAdminOnly, create);
// router.patch('/:id', protect, superAdminOnly, update);


// export default router;





import express from 'express';
import { list, getOne, create } from '../controllers/departmentController.js';
import { authMiddleware, roleCheck } from '../middleware/auth.js';
import Department from '../models/Department.js';

const router = express.Router();

/**
 * @route   GET /api/departments
 * @desc    List all departments
 * @access  Public (or add authMiddleware if needed)
 */
router.get('/', list);

/**
 * @route   GET /api/departments/:id
 * @desc    Get a single department
 * @access  Protected
 */
router.get('/:id', authMiddleware, getOne);

/**
 * @route   POST /api/departments
 * @desc    Create a new department
 * @access  Super-Admin Only
 */
router.post('/', authMiddleware, roleCheck(['Super-Admin']), create);

/**
 * @route   PATCH /api/departments/:id
 * @desc    Update department budget (Director/Super-Admin)
 * @access  Protected
 */
router.patch('/:id', authMiddleware, roleCheck(['Director', 'Super-Admin']), async (req, res) => {
    try {
        const { budgetAllocated } = req.body;
        
        // Find by ID and update the budget field
        const dept = await Department.findByIdAndUpdate(
            req.params.id, 
            { budgetAllocated }, 
            { new: true, runValidators: true }
        );

        if (!dept) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.json(dept);
    } catch (err) {
        console.error("Budget Update Error:", err.message);
        res.status(500).json({ 
            message: "Server Error", 
            error: err.message 
        });
    }
});

export default router;