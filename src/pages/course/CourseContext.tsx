import { type ReactNode, type FC, createContext, useState, useEffect, type SetStateAction } from "react";
import { useGetCourseQuery } from "../../app/services/coursesApi";
import { useParams } from "react-router-dom";
import type { Course, ResultsTest } from "../../app/types";
import { showMessage } from "../../utils/showMessage";
import { useAppSelector } from "../../app/hooks";
import { selectCurrent } from "../../features/user/userSlice";
import { hasErrorField } from "../../utils/hasErrorField";
import { useAddResultsMutation } from "../../app/services/resultsApi";

type CourseContext = {
    stage: SetStateAction<"theoretiacalMaterials" | "testing">
    courseData: Course | null
    isLoading: boolean
    isError: boolean
    currentQuestion: number
    answers: string[] | null
    resultTest: Omit<ResultsTest, "id"> | null
    isShowResultModal: boolean
    stateTestingIsUnderway: boolean
    handleResetTesting: () => void
    setStateTestingIsUnderway: (state: SetStateAction<boolean>) => void
    setShowResultModal: (state: boolean) => void
    setStage: (stage: SetStateAction<"theoretiacalMaterials" | "testing">) => void
    handleAnswer: (answer: string) => void;
    handleNext: () => void;
    handlePrev: () => void;
    submitResults: () => void
}

export const CourseContext = createContext<CourseContext>({
    stage: "theoretiacalMaterials",
    courseData: null,
    isLoading: false,
    isError: false,
    currentQuestion: 0,
    answers: null,
    isShowResultModal: false,
    stateTestingIsUnderway: false,
    resultTest: null,
    handleResetTesting: () => { },
    setStateTestingIsUnderway: (state) => { },
    setShowResultModal: (state) => { },
    setStage: (stage) => { },
    handleAnswer: (answer) => { },
    handleNext: () => { },
    handlePrev: () => { },
    submitResults: async () => { }
});

type Props = {
    children: ReactNode
}

export const CourseContextProvider: FC<Props> = ({ children }) => {
    const params = useParams();

    const user = useAppSelector(selectCurrent);

    const [isShowResultModal, setIsShowResultModal] = useState<boolean>(false);
    const [stateTestingIsUnderway, setStateTestingIsUnderway] = useState<boolean>(false);

    const [stage, setDataStage] = useState<"theoretiacalMaterials" | "testing">("theoretiacalMaterials");

    const [resultTest, setResultTest] = useState<Omit<ResultsTest, "id"> | null>(null);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [courseData, setCourseData] = useState<Course | null>(null);
    const [answers, setAnswers] = useState(new Array(courseData?.questions.length).fill(null));

    const { data, isLoading, isError } = useGetCourseQuery(params?.id ?? "");
    const [addResults] = useAddResultsMutation();

    useEffect(() => {
        if (!isLoading && !isError) {
            setCourseData(data!);
        }
    }, [isLoading, isError]);

    const handleAnswer = (answer: string) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        setAnswers(newAnswers);
    }

    const handleNext = () => {
        if (currentQuestion < courseData!.questions.length - 1) {
            setCurrentQuestion((prevState) => prevState + 1);
            return;
        }
        calculateResult();
    }

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    }

    const calculateResult = () => {
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer === courseData!.questions[index].correctAnswer) {
                score++;
            }
        })
        setResultTest({
            courseId: courseData!.id,
            userId: user!.id,
            resultProcent: (score / courseData!.questions.length) * 100
        });
        setIsShowResultModal(true);
    }

    const submitResults = async () => {        
        try {
            await addResults(resultTest!).unwrap();
            showMessage({ message: "Результаты тестирования сохранены", variantMessage: "success" });
            handleResetTesting();
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" });
            }
        }
    }

    const handleResetTesting = () => {
        setIsShowResultModal(false);
        setStateTestingIsUnderway(false);
        setResultTest(null);
        setAnswers(new Array(courseData?.questions.length).fill(null));
        setCurrentQuestion(0);
    }

    const setStage = (stage: SetStateAction<"theoretiacalMaterials" | "testing">) => {
        if (stateTestingIsUnderway) {
            showMessage({ message: "Во время тестирования запрещено перемещаться между вкладками", variantMessage: "warning" });
            return;
        }
        setDataStage(stage);
    }

    const setShowResultModal = (state: boolean) => {
        setIsShowResultModal(state);
    }

    const courseContext = {
        stage,
        courseData,
        isLoading,
        isError,
        currentQuestion,
        answers,
        isShowResultModal,
        resultTest,
        stateTestingIsUnderway,
        handleResetTesting,
        setStateTestingIsUnderway,
        submitResults,
        setStage,
        setShowResultModal,
        handleAnswer,
        handleNext,
        handlePrev,
    }

    return <CourseContext.Provider value={courseContext}>{children}</CourseContext.Provider>
}



