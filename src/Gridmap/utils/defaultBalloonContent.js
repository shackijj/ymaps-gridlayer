/**
 * Default balloon content.
 *
 * @param {Array} points.
 * @this Gridmap
 */
const defaultBalloonContent = function (points) {
    return {
        balloonContentBody: `
                    <ul>
                        ${points.map(({feature: {properties}}) => `<li>${properties.Attributes.Name}</li>`).join('')}
                    </ul>
                `,
        balloonContentHeader: `${points.length} точек`,
        balloonContentFooter: 'Нижняя часть балуна.',
        hintContent: `Тут ${points.length} точек`
    };
};

export default defaultBalloonContent;
