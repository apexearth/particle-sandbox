export default {
    explorerOrEdge: typeof window !== 'undefined' ? isExplorerOrEdge() : undefined
}

function isExplorerOrEdge() {
    return (
        /MSIE/i.test(navigator.userAgent) ||
        /rv:11.0/i.test(navigator.userAgent) ||
        /Edge\/\d./i.test(navigator.userAgent)
    )
}
