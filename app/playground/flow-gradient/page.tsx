export default function FlowGradientPage() {
    return (
        <div className="section page-top-margin">
            <div className="subsection">
                <h1 className="headline font-serif font-light soft-70">
                    Flow Gradient Component
                </h1>
            </div>
            <div className="subsection mt-8">
                <div className="size-50 border overflow-hidden relative blur-in-2xl">
                    <div className="w-20 h-20 rounded-full scale-x-200 border bg-linear-to-r from-orange-500 to-yellow-500" />
                </div>
            </div>
        </div>
    )
}