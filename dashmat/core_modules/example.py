import random

from dashmat.core_modules.base import CheckBase


class RandomNumbers(CheckBase):
    def register_checks(self):
        yield "* * * * *", self.every_minute

    def every_minute(self, time):
        yield 'number', random.randint(1, 1000)
        yield 'list', [random.randint(1, 1000) for _ in range(10)]
        yield 'float', random.random() * 1000
