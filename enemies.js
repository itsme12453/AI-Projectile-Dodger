export default function updateEnemyBouncing(enemy){
    if (enemy.pos.x <= enemy.radius) {
        enemy.direction.x = -enemy.direction.x;
    } else if (enemy.pos.x >= canvas.width - enemy.radius) {
        enemy.direction.x = -enemy.direction.x;
    } else if (enemy.pos.y <= enemy.radius) {
        enemy.direction.y = -enemy.direction.y;
    } else if (enemy.pos.y >= canvas.height - enemy.radius) {
        enemy.direction.y = -enemy.direction.y;
    }
}
