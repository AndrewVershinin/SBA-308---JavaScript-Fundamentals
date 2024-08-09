

// Example usage
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        { id: 1, name: "Declare a Variable", due_at: "2023-01-25", points_possible: 50 },
        { id: 2, name: "Write a Function", due_at: "2023-02-27", points_possible: 150 },
        { id: 3, name: "Code the World", due_at: "3156-11-15", points_possible: 500 }
    ]
};

const LearnerSubmissions = [
    { learner_id: 125, assignment_id: 1, submission: { submitted_at: "2023-01-25", score: 47 } },
    { learner_id: 125, assignment_id: 2, submission: { submitted_at: "2023-02-12", score: 150 } },
    { learner_id: 125, assignment_id: 3, submission: { submitted_at: "2023-01-25", score: 400 } },
    { learner_id: 132, assignment_id: 1, submission: { submitted_at: "2023-01-24", score: 39 } },
    { learner_id: 132, assignment_id: 2, submission: { submitted_at: "2023-03-07", score: 140 } }
];

// create a function to check if the given AssignmentGroup belongs to the specified CourseInfo.

function matchCourseAssignmentId(CourseInfo, AssignmentGroup) {
    return CourseInfo.id === AssignmentGroup.course_id;
}

// create a function to validate a learner's submission to ensure the score and points possible are valid.

function isValidSubmission(submission, assignment) {
    const { score } = submission.submission; // Extracts the score property from the submission.submission object
    const { points_possible: pointsPossible } = assignment; // Extracts the points_possible property from the assignment object and renames it to pointsPossible

    // check if points_possible is a positive number
    if (typeof pointsPossible !== 'number' || pointsPossible <= 0) {
        console.error(`Invalid points_possible: ${pointsPossible}. Must be a positive number.`);
        return false;
    }

    // check if score is a number
    if (typeof score !== 'number') {
        console.error(`Invalid score: ${score}. Must be a number.`);
        return false;
    }

    // check if score is non-negative
    if (score < 0) {
        console.error(`Invalid score: ${score}. Must be non-negative.`);
        return false;
    }

    // if all pass
    return true;
}

// create a function to calculate the weighted average score for a learner.
function calculateAvgScore(learnerData) {
    return (learnerData.totalScore / learnerData.totalWeight) * 100; // It divides the totalScore by the totalWeight (sum of points possible) and multiplies by 100 to get a percentage.
}

// create a main function to processes the learner data to calculate individual assignment scores and total scores
function processLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions) {
    // checks if the AssignmentGroup belongs to the CourseInfo
    if (!matchCourseAssignmentId(CourseInfo, AssignmentGroup)) { 
        throw new Error(`AssignmentGroup ${AssignmentGroup.id} does not belong to Course ${CourseInfo.id}.`); 
    }

    const assignments = AssignmentGroup.assignments;
    // initializes assignmentScores and learnerData as Map objects to store data more efficiently.
    const assignmentScores = new Map();
    const learnerData = new Map();
    // initializes the assignmentScores map where each assignment ID maps to an empty array.
    // iterates over assignments and sets each assignment's ID as a key in the assignmentScores map, initializing it with an empty array.
    assignments.forEach(assignment => {
        assignmentScores.set(assignment.id, []);
    });

    // processes each submission to update learner data and assignment scores.
    for (const submission of LearnerSubmissions) {
        const { learner_id: learnerID, assignment_id: assignmentID, submission: { submitted_at, score } } = submission; // extracts learnerID, assignmentID, submitted_at, and score from each submission.
        const assignment = assignments.find(a => a.id === assignmentID); // the find method will return the first assignment object whose id matches the assignmentID. This assignment object is then stored in the assignment variable.

        if (!assignment) {
            console.warn(`Assignment ID ${assignmentID} not found.`);
            continue;
        }

        // calls isValidSubmission to ensure the score is valid and the assignment points are positive.
        //id: learnerID: Sets the learner's ID.
        //totalScore: 0: Initializes the total score to 0. This will accumulate the learner’s scores from all valid submissions.
        //totalWeight: 0: Initializes the total weight to 0. This will accumulate the points possible from all assignments.
        //assignments: {}: Initializes an empty object to store scores for individual assignments.
        if (!isValidSubmission(submission, assignment)) {
            continue;
        }

        if (!learnerData.has(learnerID)) {
            learnerData.set(learnerID, {
                id: learnerID,
                totalScore: 0,
                totalWeight: 0,
                assignments: {}
            });
        }

        const learner = learnerData.get(learnerID); // a method call that get the value associated with the key learnerID from the learnerData map.
        const pointsPossible = assignment.points_possible; // it represents the maximum number of points that a learner can earn for this assignment.
        let scorePercentage = score / pointsPossible; // calculates the percentage score that the learner earned for the assignment.

        // check if a submission was made after the assignment's due date. If the submission is late, it reduces the score by 10%.
        if (new Date(submitted_at) > new Date(assignment.due_at)) {
            console.warn(`Submission for assignment ID ${assignmentID} is late.`);
            scorePercentage *= 0.9;
        }

        learner.assignments[assignmentID] = (scorePercentage * 100)
        learner.totalScore += score;
        learner.totalWeight += pointsPossible;

        }

        return {learnerData, assignmentScores}
        
    }

//getLearnerData processes learner submissions, calculates their scores, and formats the results into a structured format
function getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions) {
    try {
        const {learnerData, assignmentScores} = processLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

        const results = [];

        learnerData.forEach(learner => {
            const weightedAvg = calculateAvgScore(learner); // takes the learner's total score and total weight and calculates their weighted average score.

            const learnerResult = {
                id: learner.id,
                avg: weightedAvg.toFixed(3)
            };
        
            for (const assignmentID in learner.assignments) {
                learnerResult[assignmentID] = learner.assignments[assignmentID];
            }

            results.push(learnerResult); // adds the learnerResult object to the results array, which collects all the formatted results.

            return results;
        });
    } catch (error) {
        console.error(error.message);
    }
}

let result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
