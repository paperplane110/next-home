export default function PaperBg() {
    return (
        <>
            <div
                className="fixed inset-0 pointer-events-none z-[-2] bg-repeat opacity-[0.035]"
                style={{
                    backgroundSize: "180px",
                    backgroundImage: "url('/img/noise.png')",
                }}
            />
            <div
                className="fixed inset-0 pointer-events-none z-[-1]"
            />
        </>
    );
}