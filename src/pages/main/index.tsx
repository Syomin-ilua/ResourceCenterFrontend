import { Container } from "../../components/container";
import styles from "./index.module.css";
import MainBackground from "../../assets/images/main-background.jpg";
import Reward from "../../assets/images/reward.png";
import { Link } from "react-router-dom";
import { SVG } from "../../components/svg";
import Certificate from "../../assets/images/certificate.png";
import { useEffect } from "react";

interface IAdvatages {
    id: number,
    title: string,
    description: string,
    iconID: string
}

const advantages: IAdvatages[] = [
    {
        id: 1,
        title: "Персонализированные программы обучения",
        description: "Мы разрабатываем индивидуальные образовательные программы, учитывая потребности и уровень подготовки каждого участника.",
        iconID: "programm-icon"
    },
    {
        id: 2,
        title: "Экспертный подход",
        description: "Наши преподаватели - это опытные специалисты с глубокими знаниями в области производства пластиковых труб.",
        iconID: "expert-icon"
    },
    {
        id: 3,
        title: "Актуальность материалов",
        description: "Мы постоянно обновляем учебные материалы и методики обучения, чтобы наши курсы отражали последние тенденции и инновации.",
        iconID: "actual-icon"
    },
    {
        id: 4,
        title: "Сертификация и признание",
        description: "Наши курсы завершаются выдачей сертификата, который является признанием полученных знаний и навыков.",
        iconID: "certificate-icon"
    }
];

export const Main = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <>
            <section className={styles.greeting}>
                <Container>
                    <div className={styles.greeting__wrapper}>
                        <img className={styles.greeting__img} src={MainBackground} alt="" />
                        <div className={styles.greeting__wrapp}>
                            <div className={styles.greeting__text_wrapper}>
                                <p className={styles.greeting__text}>
                                    Мы рады приветствовать вас на сайте, предназначенном для поддержки сотрудников ООО "Пластъ" в их профессиональном развитии. Здесь вы найдете актуальные новости, обучающие материалы, курсы с тестами для повышения квалификации, и многое другое. Наши ресурсы помогут вам приобрести необходимые знания и навыки для успешной работы.
                                </p>
                                <Link className={styles.btn__link} to="/courses">
                                    Пройти курс
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            <section className={styles.advantages}>
                <Container>
                    <div className={styles.title_wrapper}>
                        <SVG id="advantages-icon" />
                        <h1 className={styles.section__title}>Преимущества нашего сервиса</h1>
                    </div>
                    <div className={styles.advatages__wrapper}>
                        {advantages.map(advantage => (
                            <div className={styles.advantage__item}>
                                <div className={styles.advantage__image}>
                                    <SVG id={advantage.iconID} />
                                </div>
                                <div className={styles.advantage__title_wrapper}>
                                    <h2 className={styles.advantage__title}>{advantage.title}</h2>
                                </div>
                                <div className={styles.advantage__description_wrapper}>
                                    <p className={styles.advantage__description}>{advantage.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
            <section className={styles.certificate}>
                <Container>
                    <div className={styles.title_wrapper}>
                        <h1 className={styles.section__title}>После окончания курса вам выдаётся сертификат</h1>
                    </div>
                    <div className={styles.certificate__wrapper}>
                        <img className={styles.certificate__image} src={Certificate} alt="Сертификат по окончанию курса" />
                    </div>
                </Container>
            </section>
        </>
    )
}