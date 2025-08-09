import { useEffect, useState } from "react";

// SVG digit segments for a 7-segment display
const SEGMENTS = [
//  [A, B, C, D, E, F, G]
    [1, 1, 1, 1, 1, 1, 0], // 0                 ----A----
    [0, 1, 1, 0, 0, 0, 0], // 1                |         | 
    [1, 1, 0, 1, 1, 0, 1], // 2                F         B 
    [1, 1, 1, 1, 0, 0, 1], // 3                |         | 
    [0, 1, 1, 0, 0, 1, 1], // 4                 ----G----
    [1, 0, 1, 1, 0, 1, 1], // 5                |         | 
    [1, 0, 1, 1, 1, 1, 1], // 6                E         C 
    [1, 1, 1, 0, 0, 0, 0], // 7                |         |
    [1, 1, 1, 1, 1, 1, 1], // 8                 ----D----
    [1, 1, 1, 1, 0, 1, 1], // 9
    [0, 0, 0, 0, 0, 0, 0], // nothing
    [1, 0, 0, 0, 0, 0, 0], // top
    [1, 1, 0, 0, 0, 0, 0], // top, right top
    [1, 1, 1, 0, 0, 0, 0], // top, right
    [1, 1, 1, 1, 0, 0, 0], // top, right, bottom
    [0, 0, 0, 1, 0, 0, 0], // bottom
    [1, 0, 0, 1, 0, 0, 0], // bottom, top
    [1, 0, 0, 1, 1, 0, 0], // bottom, left bottom, top
    [1, 0, 0, 1, 1, 1, 0], // bottom, left, top
    [0, 0, 0, 1, 1, 1, 0], // bottom, left
    [0, 1, 1, 1, 0, 0, 0], // bottom, right
    [0, 0, 1, 1, 0, 0, 0], // bottom, right bottom
    [0, 0, 0, 0, 1, 1, 0], // left
    [0, 0, 0, 0, 0, 1, 0], // left top
];

function Digit({ n }: { n?: number }) {
    if (n === undefined || n < 0 || n >= SEGMENTS.length) {
        n = 10; // default to nothing
    }
    const on = (i: number) => SEGMENTS[n][i] ? 'orange' : '#222';
    return (
        <svg
            width={48}
            height={85}
            viewBox="3 4 50 88"
            style={{
                margin: '0 3px',
                width: 'caclc( 48 / 338 * 100% )',
                height: 'caclc( 48 / 338 * 100% )',
            }}
        >
            {/* a */}
            <path className="a" d="M 10,8 L 14,4 L 42,4 L 46,8 L 42,12 L 14,12 L 10,8 z" fill={on(0)} />
            {/* b */}
            <path className="b" d="M 48,10 L 52,14 L 52,42 L 48,46 L 44,42 L 44,14 L 48,10 z" fill={on(1)} />
            {/* c */}
            <path className="c" d="M 48,50 L 52,54 L 52,82 L 48,86 L 44,82 L 44,54 L 48,50 z" fill={on(2)} />
            {/* d */}
            <path className="d" d="M 10,88 L 14,84 L 42,84 L 46,88 L 42,92 L 14,92 L 10,88 z" fill={on(3)} />
            {/* e */}
            <path className="e" d="M 8,50 L 12,54 L 12,82 L 8,86 L 4,82 L 4,54 L 8,50 z" fill={on(4)} />
            {/* f */}
            <path className="f" d="M 8,10 L 12,14 L 12,42 L 8,46 L 4,42 L 4,14 L 8,10 z" fill={on(5)} />
            {/* g */}
            <path className="g" d="M 10,48 L 14,44 L 42,44 L 46,48 L 42,52 L 14,52 L 10,48 z" fill={on(6)} />

        </svg>
    );
}

function Colon({ on = true }: { on?: boolean }) {
    return (
        <svg width={16} height={56} viewBox="0 0 16 56">
            <circle cx="8" cy="18" r="4" fill={on ? "orange" : "#222"} />
            <circle cx="8" cy="38" r="4" fill={on ? "orange" : "#222"} />
        </svg>
    );
}

type ClockProps = {
    countdownTo?: Date | number;
    noTime?: boolean;
    aroundAnimation?: boolean;
};

const AROUND_ANIMATION = [
    [10, 10, 10, 10, 10, 10],
    [11, 10, 10, 10, 10, 10],
    [11, 11, 10, 10, 10, 10],
    [11, 11, 11, 10, 10, 10],
    [11, 11, 11, 11, 10, 10],
    [11, 11, 11, 11, 11, 10],
    [11, 11, 11, 11, 11, 11],
    [11, 11, 11, 11, 11, 12],
    [11, 11, 11, 11, 11, 13],
    [11, 11, 11, 11, 11, 14],
    [11, 11, 11, 11, 16, 14],
    [11, 11, 11, 16, 16, 14],
    [11, 11, 16, 16, 16, 14],
    [11, 16, 16, 16, 16, 14],
    [16, 16, 16, 16, 16, 14],
    [17, 16, 16, 16, 16, 14],
    [18, 16, 16, 16, 16, 14],
    [19, 16, 16, 16, 16, 14],
    [19, 15, 16, 16, 16, 14],
    [19, 15, 15, 16, 16, 14],
    [19, 15, 15, 15, 16, 14],
    [19, 15, 15, 15, 15, 14],
    [19, 15, 15, 15, 15, 20],
    [19, 15, 15, 15, 15, 21],
    [19, 15, 15, 15, 15, 15],
    [19, 15, 15, 15, 15, 10],
    [19, 15, 15, 15, 10, 10],
    [19, 15, 15, 10, 10, 10],
    [19, 15, 10, 10, 10, 10],
    [19, 10, 10, 10, 10, 10],
    [22, 10, 10, 10, 10, 10],
    [23, 10, 10, 10, 10, 10],
]

export default function Clock(props: ClockProps) {
    const [on, setOn] = useState(false);
    const [roundAnimationState, setRoundAnimationState] = useState([] as number[]);

    // Clock code
    // useEffect(() => {
    //     const id = setInterval(() => setTime(new Date()), 1000);
    //     return () => clearInterval(id);
    // }, []);
    // const h = time.getHours().toString().padStart(2, '0');
    // const m = time.getMinutes().toString().padStart(2, '0');
    // const s = time.getSeconds().toString().padStart(2, '0');

    // Countdown logic
    const [timeLeft, setTimeLeft] = useState(() => {
        const now = new Date();
        const nextHour = new Date(now);
        nextHour.setHours(now.getMinutes() === 0 && now.getSeconds() === 0 ? now.getHours() : now.getHours() + 1, 0, 0, 0);
        const diff = nextHour.getTime() - now.getTime();
        return diff > 0 ? diff : 0;
    });
    useEffect(() => {
        const countdown = () => {
            const now = new Date();
            const nextHour = new Date(now);
            nextHour.setHours(now.getMinutes() === 0 && now.getSeconds() === 0 ? now.getHours() : now.getHours() + 1, 0, 0, 0);
            const countdownToDate = props.countdownTo instanceof Date ? props.countdownTo : new Date(props.countdownTo);
            const countdownTo = props.countdownTo && countdownToDate || nextHour;
            const diff = countdownTo.getTime() - now.getTime();
            setTimeLeft(diff > 0 ? diff : 0);
        }
        countdown();
        const id = setInterval(() => {
            countdown();
        }, 1000);
        return () => clearInterval(id);
    }, [props.countdownTo]);

    // Convert ms to hh:mm:ss
    const totalSeconds = Math.floor(timeLeft / 1000);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');

    useEffect(() => {
        let m: NodeJS.Timeout | undefined;
        if (props.noTime) {
            m = setInterval(() => { setOn((state) => !state) }, 1000);
        }
        return () => clearInterval(m);
    }, [props.noTime]);

    useEffect(() => {
        let m: NodeJS.Timeout | undefined;
        let state = 0;
        if (props.aroundAnimation) {
            m = setInterval(() => { 
                setRoundAnimationState(AROUND_ANIMATION[state]);
                state++;
                if (state >= AROUND_ANIMATION.length) {
                    state = 0;
                }
            }, 100);
        } else {
            () => clearInterval(m);
        }
        return () => clearInterval(m);
    }, [props.aroundAnimation]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', background: '#111', padding: 8, borderRadius: 8, width: '330px', margin: 'auto' }}>
            {
                props.noTime ?
                <>
                    <Digit n={on ? 8 : 10} />
                    <Digit n={on ? 8 : 10} />
                    <Colon />
                    <Digit n={on ? 8 : 10} />
                    <Digit n={on ? 8 : 10} />
                    <Colon />
                    <Digit n={on ? 8 : 10} />
                    <Digit n={on ? 8 : 10} />
                </>
                :
                props.aroundAnimation ?
                <>
                    <Digit n={roundAnimationState[0]} />
                    <Digit n={roundAnimationState[1]} />
                    <Colon on={false} />
                    <Digit n={roundAnimationState[2]} />
                    <Digit n={roundAnimationState[3]} />
                    <Colon on={false} />
                    <Digit n={roundAnimationState[4]} />
                    <Digit n={roundAnimationState[5]} />
                </>
                :
                <>
                    <Digit n={+h[0]} />
                    <Digit n={+h[1]} />
                    <Colon />
                    <Digit n={+m[0]} />
                    <Digit n={+m[1]} />
                    <Colon />
                    <Digit n={+s[0]} />
                    <Digit n={+s[1]} />
                </>
            }
        </div>
    );
}
