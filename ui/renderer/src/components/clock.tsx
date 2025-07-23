import { useEffect, useState } from "react";

// SVG digit segments for a 7-segment display
const SEGMENTS = [
    // a, b, c, d, e, f, g
    [1, 1, 1, 1, 1, 1, 0], // 0
    [0, 1, 1, 0, 0, 0, 0], // 1
    [1, 1, 0, 1, 1, 0, 1], // 2
    [1, 1, 1, 1, 0, 0, 1], // 3
    [0, 1, 1, 0, 0, 1, 1], // 4
    [1, 0, 1, 1, 0, 1, 1], // 5
    [1, 0, 1, 1, 1, 1, 1], // 6
    [1, 1, 1, 0, 0, 0, 0], // 7
    [1, 1, 1, 1, 1, 1, 1], // 8
    [1, 1, 1, 1, 0, 1, 1], // 9
    [0, 0, 0, 0, 0, 0, 0], // nothing
];

function Digit({ n }: { n: number }) {
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

function Colon() {
    return (
        <svg width={16} height={56} viewBox="0 0 16 56">
            <circle cx="8" cy="18" r="4" fill="orange" />
            <circle cx="8" cy="38" r="4" fill="orange" />
        </svg>
    );
}

type ClockProps = {
    countdownTo?: Date;
    minting?: boolean;
};

export default function Clock(props: ClockProps) {
    const [on, setOn] = useState(false);

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
        const id = setInterval(() => {
            const now = new Date();
            const nextHour = new Date(now);
            nextHour.setHours(now.getMinutes() === 0 && now.getSeconds() === 0 ? now.getHours() : now.getHours() + 1, 0, 0, 0);
            const countdownTo = props.countdownTo || nextHour;
            const diff = countdownTo.getTime() - now.getTime();
            setTimeLeft(diff > 0 ? diff : 0);
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
        if (props.minting) {
            m = setInterval(() => { setOn((state) => !state) }, 1000);
        }
        return () => clearInterval(m);
    }, [props.minting]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', background: '#111', padding: 8, borderRadius: 8, width: '330px', margin: 'auto' }}>
            {
                props.minting ?
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
